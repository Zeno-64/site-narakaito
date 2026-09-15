"""Gera as fotos que o site serve, a partir dos originais do estúdio.

Por que existir: os originais são JPEG de 2K/4K, 2 a 6 MB cada -- 250 MB no
lote de setembro. O site serve WebP em dois tamanhos: 560 px para card e
miniatura, 1200 px para a foto grande. Dá ~15 MB no total.

Os originais ficam fora do git (`assets-originais/`, no .gitignore), porque
qualquer coisa dentro de `public/` vai inteira para o `dist/` a cada deploy.

A ordenação é natural: `peca-02` vem antes de `peca-10`. Os nomes já saem
numerados da pasta do estúdio, então basta ordenar por número.

    python ferramentas/fotos/gerar_fotos.py <pasta-de-originais>

A pasta de originais tem uma subpasta por peça, com o mesmo nome que vai para
`public/fotos/`, e dentro dela `<peca>-01.jpg`, `<peca>-02.jpg`, ...
"""
import os
import re
import sys

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAIDA = os.path.join(RAIZ, "public", "fotos")

TAMANHOS = [("", 1200), ("-sm", 560)]
QUALIDADE = 82


def numero(nome):
    """Ordem natural: o que importa é o número no fim do nome, não o texto."""
    achado = re.search(r"(\d+)(?=\.\w+$)", nome)
    return int(achado.group(1)) if achado else 0


def converter(origem, pasta):
    destino = os.path.join(SAIDA, pasta)
    os.makedirs(destino, exist_ok=True)

    arqs = sorted(
        (a for a in os.listdir(origem) if a.lower().endswith((".jpg", ".jpeg", ".png"))),
        key=numero,
    )
    for i, arq in enumerate(arqs, 1):
        im = Image.open(os.path.join(origem, arq)).convert("RGB")
        for sufixo, lado in TAMANHOS:
            copia = im.copy()
            copia.thumbnail((lado, lado), Image.LANCZOS)
            copia.save(
                os.path.join(destino, f"{pasta}-{i:02d}{sufixo}.webp"),
                "WEBP",
                quality=QUALIDADE,
                method=6,
            )
    return len(arqs)


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    raiz_originais = sys.argv[1]

    total = 0
    for pasta in sorted(os.listdir(raiz_originais)):
        origem = os.path.join(raiz_originais, pasta)
        if not os.path.isdir(origem):
            continue
        n = converter(origem, pasta)
        total += n
        print(f"{pasta}: {n} fotos")
    print(f"total: {total} fotos, {2 * total} arquivos")


if __name__ == "__main__":
    main()
