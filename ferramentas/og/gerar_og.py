"""Gera as imagens de preview de link (Open Graph) das peças.

Por que existir: foto quadrada vira card pequeno no WhatsApp. O card grande,
que é o que faz alguém parar de rolar, precisa de 1200x630 -- e em JPEG, que
todo crawler lê sem discussão.

Recorte 1.91:1 numa foto vertical cortaria a cabeça da peça, então a foto vai
inteira no centro e o fundo é uma cópia dela mesma, ampliada, borrada e
escurecida. Fica no tom da peça sem precisar de fonte nem de texto.

Rodar de novo sempre que entrar peça nova:

    python ferramentas/og/gerar_og.py
"""
import os
import re

from PIL import Image, ImageEnhance, ImageFilter

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DADOS = os.path.join(RAIZ, "src", "data", "site.ts")
FOTOS = os.path.join(RAIZ, "public", "fotos")
SAIDA = os.path.join(RAIZ, "public", "og")

LARGURA, ALTURA = 1200, 630
FUNDO = (7, 6, 5)  # ink-950, a base escura do site


def pecas_do_site():
    """Tira (slug, pasta) do site.ts. Regex em vez de parser: o arquivo é uma
    lista de literais, e assim este script não depende de rodar TypeScript."""
    fonte = open(DADOS, encoding="utf-8").read()
    inicio = fonte.index("export const pecas")
    fim = fonte.index("export const products")
    achados = re.findall(r"slug: '([^']+)'|fotos\('([^']+)'", fonte[inicio:fim])

    saida, slug = [], None
    for s, pasta in achados:
        if s:
            slug = s
        elif pasta and slug:
            saida.append((slug, pasta))
            slug = None
    return saida


def capa(pasta):
    """A primeira foto da pasta é a capa -- mesma regra que o site usa."""
    return os.path.join(FOTOS, pasta, f"{pasta}-01.webp")


def montar(foto):
    im = Image.open(foto).convert("RGB")

    # fundo: a própria foto cobrindo o quadro, borrada e escurecida
    escala = max(LARGURA / im.width, ALTURA / im.height) * 1.15
    fundo = im.resize((round(im.width * escala), round(im.height * escala)), Image.LANCZOS)
    esq = (fundo.width - LARGURA) // 2
    topo = (fundo.height - ALTURA) // 2
    fundo = fundo.crop((esq, topo, esq + LARGURA, topo + ALTURA))
    fundo = fundo.filter(ImageFilter.GaussianBlur(28))
    fundo = ImageEnhance.Brightness(fundo).enhance(0.34)

    # a peça inteira, contida na altura, um pouco à direita do centro
    alvo = ALTURA - 56
    frente = im.copy()
    frente.thumbnail((LARGURA, alvo), Image.LANCZOS)

    tela = Image.new("RGB", (LARGURA, ALTURA), FUNDO)
    tela.paste(fundo, (0, 0))
    tela.paste(frente, ((LARGURA - frente.width) // 2, (ALTURA - frente.height) // 2))
    return tela


if __name__ == "__main__":
    os.makedirs(SAIDA, exist_ok=True)
    for slug, pasta in pecas_do_site():
        origem = capa(pasta)
        if not os.path.exists(origem):
            print("sem capa:", slug, origem)
            continue
        destino = os.path.join(SAIDA, f"{slug}.jpg")
        montar(origem).save(destino, "JPEG", quality=80, optimize=True, progressive=True)
        print(f"{slug:20s} {os.path.getsize(destino) // 1024:4d} KB")
