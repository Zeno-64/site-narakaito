import { useRef } from 'react'
import type { PointerEvent as EventoDePonteiro } from 'react'

type Opcoes = {
  /** Chamado com 1 para "próxima" (arrastou para a esquerda) e -1 para "anterior". */
  aoArrastar: (direcao: 1 | -1) => void
  /** Quantos pixels o dedo precisa andar antes de valer como swipe. */
  limite?: number
}

/**
 * Arrasto horizontal para os carrosséis de foto.
 *
 * Pointer Events em vez de touchstart/touchend: o mesmo código cobre dedo,
 * caneta e mouse, e ainda dá o `pointercancel` de graça quando o navegador
 * decide que o gesto virou rolagem da página.
 *
 * Quem usa precisa marcar o elemento com `touch-pan-y`. Sem isso o Chrome no
 * Android trata o arrasto lateral como gesto dele (voltar/avançar página) e
 * cancela a sequência de pointermove antes de o swipe fechar.
 */
export function useArrastoHorizontal({ aoArrastar, limite = 45 }: Opcoes) {
  const inicio = useRef<{ x: number; y: number } | null>(null)
  const jaDisparou = useRef(false)

  const encerrar = () => {
    inicio.current = null
  }

  return {
    onPointerDown: (e: EventoDePonteiro) => {
      // no mouse, só o botão esquerdo arrasta
      if (e.pointerType === 'mouse' && e.button !== 0) return
      inicio.current = { x: e.clientX, y: e.clientY }
      jaDisparou.current = false
    },
    onPointerMove: (e: EventoDePonteiro) => {
      if (!inicio.current || jaDisparou.current) return

      const dx = e.clientX - inicio.current.x
      const dy = e.clientY - inicio.current.y

      // A rolagem da página ganha: se o dedo desceu mais do que andou para o
      // lado, o gesto era scroll e este carrossel não tem nada a ver com isso.
      if (Math.abs(dy) > Math.abs(dx)) {
        encerrar()
        return
      }

      if (Math.abs(dx) < limite) return

      // Dispara uma vez por arrasto: sem isso, um swipe longo passaria várias
      // fotos de uma vez enquanto o dedo ainda está na tela.
      jaDisparou.current = true
      encerrar()
      aoArrastar(dx < 0 ? 1 : -1)
    },
    onPointerUp: encerrar,
    onPointerCancel: encerrar,
    onPointerLeave: encerrar,
  }
}
