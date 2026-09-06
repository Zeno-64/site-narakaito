import { useEffect, useRef, useState } from 'react'
import type { MotionValue } from 'framer-motion'

type Props = {
  /** Mesmo progresso 0→1 que move a caixa em CSS. */
  progresso: MotionValue<number>
  /** Avisa a caixa quando o 3D está pronto, para a foto sair de cena. */
  aoFicarPronto: () => void
  /** Elemento da parede da frente: o topo dele é a boca da caixa. */
  boca: React.RefObject<HTMLElement | null>
}

/** O modelo só começa a baixar quando a seção chega perto da tela. */
const MARGEM_DE_CARGA = '120% 0px'

/**
 * A peça em 3D subindo de dentro da caixa.
 *
 * Fica num <canvas> por cima da caixa, que continua sendo CSS 3D. Canvas e
 * CSS 3D não se intercalam -- o canvas é sempre uma camada inteira na frente
 * --, então a ilusão de "sair de dentro" vem de um clip-path: tudo abaixo da
 * boca da caixa é recortado enquanto o modelo sobe, e o recorte só abre
 * depois que a caixa se dissolve.
 *
 * Tudo aqui é opcional: three.js entra por import dinâmico e vira um chunk
 * separado, e qualquer falha (sem WebGL, rede, prefers-reduced-motion) deixa
 * a foto original no lugar, que é o que a caixa mostra até o 3D avisar que
 * está pronto.
 */
export default function PecaTresD({ progresso, aoFicarPronto, boca }: Props) {
  const container = useRef<HTMLDivElement>(null)
  const [recorte, setRecorte] = useState('inset(0 0 100% 0)')

  useEffect(() => {
    const alvo = container.current
    if (!alvo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelado = false
    let limpar: (() => void) | undefined

    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting)) return
        observador.disconnect()
        montar().then((f) => {
          if (cancelado) f?.()
          else limpar = f
        })
      },
      { rootMargin: MARGEM_DE_CARGA },
    )
    observador.observe(alvo)

    async function montar() {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
      const { MeshoptDecoder } = await import(
        'three/examples/jsm/libs/meshopt_decoder.module.js'
      )
      if (cancelado || !alvo) return

      let renderer: import('three').WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      } catch {
        return // placa sem WebGL: a foto continua valendo
      }

      renderer.setClearAlpha(0)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
      renderer.domElement.className = 'h-full w-full'
      alvo.appendChild(renderer.domElement)

      const cena = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)

      // Luz montada para casar com a seção: brasa quente vindo de dentro da
      // caixa, um contraluz frio atrás para descolar a silhueta do preto e
      // um ambiente fraco só para a sombra não fechar em breu.
      cena.add(new THREE.AmbientLight(0xffffff, 0.55))
      const chave = new THREE.DirectionalLight(0xfff0e2, 2.6)
      chave.position.set(2.4, 3.4, 3)
      cena.add(chave)
      const brasa = new THREE.PointLight(0xb0332c, 6, 8, 2)
      brasa.position.set(0, 0.15, 0.9)
      cena.add(brasa)
      const contraluz = new THREE.DirectionalLight(0x8fb4ff, 1.1)
      contraluz.position.set(-2.6, 1.6, -2.4)
      cena.add(contraluz)

      const grupo = new THREE.Group()
      cena.add(grupo)

      const gltf = await new GLTFLoader()
        .setMeshoptDecoder(MeshoptDecoder)
        .loadAsync('/modelos/madara.glb')
        .catch(() => null)

      if (cancelado || !gltf) {
        renderer.dispose()
        return
      }

      const modelo = gltf.scene
      // O GLB vem com a base em y=0; centralizo em X/Z e uso a altura para
      // enquadrar, para o ajuste não depender das medidas do arquivo.
      const caixa = new THREE.Box3().setFromObject(modelo)
      const tamanho = caixa.getSize(new THREE.Vector3())
      const centro = caixa.getCenter(new THREE.Vector3())
      modelo.position.set(-centro.x, -caixa.min.y, -centro.z)
      grupo.add(modelo)

      // Enquadramento pela esfera envolvente, e nao pela altura: com a base
      // de pedra e o gunbai deitado, a peca e quase tao larga quanto alta, e
      // uma distancia calculada so pela altura cortava as pontas.
      const altura = tamanho.y
      const esfera = new THREE.Box3().setFromObject(grupo).getBoundingSphere(new THREE.Sphere())
      const meiaFov = (camera.fov * Math.PI) / 360
      const distancia = (esfera.radius / Math.sin(meiaFov)) * 1.35
      camera.position.set(0, esfera.center.y, distancia)
      camera.lookAt(0, esfera.center.y, 0)

      const medir = () => {
        const { clientWidth: l, clientHeight: a } = alvo!
        renderer.setSize(l, a, false)
        camera.aspect = l / a
        camera.updateProjectionMatrix()
      }
      medir()
      const observadorDeTamanho = new ResizeObserver(medir)
      observadorDeTamanho.observe(alvo)

      aoFicarPronto()

      // Só desenha enquanto a seção está na tela: fora dela o rAF continuaria
      // rodando de graça e comendo bateria no celular.
      let visivel = true
      const observadorDeTela = new IntersectionObserver(
        (e) => {
          visivel = e.some((x) => x.isIntersecting)
        },
        { rootMargin: '10% 0px' },
      )
      observadorDeTela.observe(alvo)

      const suave = (v: number, a: number, b: number) => {
        const t = Math.min(Math.max((v - a) / (b - a), 0), 1)
        return t * t * (3 - 2 * t)
      }

      let quadro = 0
      const desenhar = (agora: number) => {
        quadro = requestAnimationFrame(desenhar)
        if (!visivel) return

        const p = progresso.get()

        // sobe de dentro da caixa e cresce um pouco no fim do percurso
        const subida = suave(p, 0.2, 0.52)
        const crescimento = suave(p, 0.52, 0.8)
        grupo.position.y = -altura * 0.5 + subida * altura * 0.72
        const escala = 0.9 + crescimento * 0.16
        grupo.scale.setScalar(escala)

        // giro lento e contínuo, com um empurrão extra durante a subida
        grupo.rotation.y = -0.5 + subida * 1.1 + agora * 0.00006

        renderer.render(cena, camera)
      }
      quadro = requestAnimationFrame(desenhar)

      return () => {
        cancelAnimationFrame(quadro)
        observadorDeTamanho.disconnect()
        observadorDeTela.disconnect()
        modelo.traverse((o) => {
          const m = o as import('three').Mesh
          if (!m.isMesh) return
          m.geometry.dispose()
          const mats = Array.isArray(m.material) ? m.material : [m.material]
          mats.forEach((mat) => {
            Object.values(mat).forEach((v) => {
              if (v && (v as { isTexture?: boolean }).isTexture) {
                ;(v as import('three').Texture).dispose()
              }
            })
            mat.dispose()
          })
        })
        renderer.domElement.remove()
        renderer.dispose()
      }
    }

    return () => {
      cancelado = true
      observador.disconnect()
      limpar?.()
    }
  }, [progresso, aoFicarPronto])

  // O recorte acompanha a boca da caixa: enquanto a caixa existe, some tudo
  // que estaria abaixo dela; quando ela se dissolve, o recorte abre.
  useEffect(() => {
    const atualizar = () => {
      const alvo = container.current
      const parede = boca.current
      if (!alvo || !parede) return

      const caixaDoAlvo = alvo.getBoundingClientRect()
      if (!caixaDoAlvo.height) return

      const p = progresso.get()
      const linha = parede.getBoundingClientRect().top - caixaDoAlvo.top
      const abertura = Math.min(Math.max((p - 0.5) / 0.14, 0), 1)
      const corte = (1 - (linha + 6) / caixaDoAlvo.height) * (1 - abertura) * 100
      setRecorte(`inset(0 0 ${Math.max(corte, 0).toFixed(2)}% 0)`)
    }

    atualizar()
    const parar = progresso.on('change', atualizar)
    window.addEventListener('resize', atualizar)
    return () => {
      parar()
      window.removeEventListener('resize', atualizar)
    }
  }, [progresso, boca])

  return (
    <div
      ref={container}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[2]"
      style={{ clipPath: recorte }}
    />
  )
}
