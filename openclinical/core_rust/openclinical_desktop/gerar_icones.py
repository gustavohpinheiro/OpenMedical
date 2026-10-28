"""
Gera os ícones do OpenClinical (desktop Tauri e PWA) a partir de um único desenho vetorial
renderizado com Pillow: quadrado arredondado verde-azulado com cruz médica e traçado de pulso.
"""

import os

from PIL import Image, ImageDraw

DIRETORIO_DESKTOP = os.path.dirname(os.path.abspath(__file__))
DIRETORIO_ICONES_DESKTOP = os.path.join(DIRETORIO_DESKTOP, "icons")
DIRETORIO_ICONES_PWA = os.path.abspath(
    os.path.join(DIRETORIO_DESKTOP, "..", "..", "frontend_ui", "public", "icons")
)

TAMANHO_BASE = 1024
COR_FUNDO_TOPO = (20, 184, 166)
COR_FUNDO_BASE = (4, 120, 87)
COR_TRACO = (255, 255, 255)


def desenhar_icone_base(margem_segura: float = 0.0) -> Image.Image:
    """Desenha o ícone em 1024px; `margem_segura` encolhe o desenho (ícones maskable)."""
    imagem = Image.new("RGBA", (TAMANHO_BASE, TAMANHO_BASE), (0, 0, 0, 0))

    gradiente = Image.new("RGBA", (TAMANHO_BASE, TAMANHO_BASE))
    pixels_gradiente = ImageDraw.Draw(gradiente)
    for y in range(TAMANHO_BASE):
        fracao = y / (TAMANHO_BASE - 1)
        cor = tuple(
            round(COR_FUNDO_TOPO[i] + (COR_FUNDO_BASE[i] - COR_FUNDO_TOPO[i]) * fracao) for i in range(3)
        )
        pixels_gradiente.line([(0, y), (TAMANHO_BASE, y)], fill=cor + (255,))

    mascara = Image.new("L", (TAMANHO_BASE, TAMANHO_BASE), 0)
    raio = 0 if margem_segura > 0 else int(TAMANHO_BASE * 0.22)
    ImageDraw.Draw(mascara).rounded_rectangle([0, 0, TAMANHO_BASE - 1, TAMANHO_BASE - 1], radius=raio, fill=255)
    imagem.paste(gradiente, (0, 0), mascara)

    escala = 1.0 - margem_segura
    deslocamento = TAMANHO_BASE * margem_segura / 2

    def ponto(x: float, y: float) -> tuple[float, float]:
        return (deslocamento + x * escala, deslocamento + y * escala)

    desenho = ImageDraw.Draw(imagem)

    # Cruz médica
    largura_braco = 140
    centro_x, centro_y, alcance = 512, 390, 210
    desenho.rounded_rectangle(
        [ponto(centro_x - largura_braco / 2, centro_y - alcance), ponto(centro_x + largura_braco / 2, centro_y + alcance)],
        radius=int(36 * escala),
        fill=COR_TRACO,
    )
    desenho.rounded_rectangle(
        [ponto(centro_x - alcance, centro_y - largura_braco / 2), ponto(centro_x + alcance, centro_y + largura_braco / 2)],
        radius=int(36 * escala),
        fill=COR_TRACO,
    )

    # Traçado de pulso (ECG) abaixo da cruz
    pulso = [(170, 800), (390, 800), (450, 700), (530, 900), (590, 760), (630, 800), (854, 800)]
    desenho.line([ponto(x, y) for x, y in pulso], fill=COR_TRACO, width=int(48 * escala), joint="curve")
    for x, y in (pulso[0], pulso[-1]):
        raio_ponta = 24 * escala
        cx, cy = ponto(x, y)
        desenho.ellipse([cx - raio_ponta, cy - raio_ponta, cx + raio_ponta, cy + raio_ponta], fill=COR_TRACO)

    return imagem


def desenhar_icone_dose_pediatrica() -> Image.Image:
    """Atalho da calculadora pediátrica: fundo azul com gota de medicamento e seringa dosadora."""
    imagem = Image.new("RGBA", (TAMANHO_BASE, TAMANHO_BASE), (0, 0, 0, 0))
    mascara = Image.new("L", (TAMANHO_BASE, TAMANHO_BASE), 0)
    ImageDraw.Draw(mascara).rounded_rectangle(
        [0, 0, TAMANHO_BASE - 1, TAMANHO_BASE - 1], radius=int(TAMANHO_BASE * 0.22), fill=255
    )
    gradiente = Image.new("RGBA", (TAMANHO_BASE, TAMANHO_BASE))
    pincel = ImageDraw.Draw(gradiente)
    topo, base = (56, 189, 248), (3, 105, 161)
    for y in range(TAMANHO_BASE):
        fracao = y / (TAMANHO_BASE - 1)
        pincel.line([(0, y), (TAMANHO_BASE, y)], fill=tuple(round(topo[i] + (base[i] - topo[i]) * fracao) for i in range(3)) + (255,))
    imagem.paste(gradiente, (0, 0), mascara)

    desenho = ImageDraw.Draw(imagem)
    # Gota: círculo inferior + triângulo superior
    desenho.ellipse([300, 420, 660, 780], fill=COR_TRACO)
    desenho.polygon([(480, 170), (318, 540), (642, 540)], fill=COR_TRACO)
    # Marcações de dose (mL) dentro da gota
    for indice, y in enumerate((520, 590, 660)):
        largura = 110 if indice != 1 else 160
        desenho.rounded_rectangle([480 - largura // 2, y - 14, 480 + largura // 2, y + 14], radius=14, fill=(3, 105, 161))
    # Selo "+" no canto (dose calculada)
    desenho.ellipse([640, 600, 900, 860], fill=(16, 185, 129), outline=COR_TRACO, width=24)
    desenho.rounded_rectangle([745, 655, 795, 805], radius=12, fill=COR_TRACO)
    desenho.rounded_rectangle([695, 705, 845, 755], radius=12, fill=COR_TRACO)
    return imagem


def salvar_png(imagem: Image.Image, caminho: str, tamanho: int) -> None:
    imagem.resize((tamanho, tamanho), Image.LANCZOS).save(caminho, format="PNG")


def gerar_icones() -> None:
    os.makedirs(DIRETORIO_ICONES_DESKTOP, exist_ok=True)
    os.makedirs(DIRETORIO_ICONES_PWA, exist_ok=True)

    icone = desenhar_icone_base()
    # Ícones maskable precisam do conteúdo dentro da zona segura central (80%) e fundo até a borda
    icone_maskable = desenhar_icone_base(margem_segura=0.2)

    salvar_png(icone, os.path.join(DIRETORIO_ICONES_DESKTOP, "32x32.png"), 32)
    salvar_png(icone, os.path.join(DIRETORIO_ICONES_DESKTOP, "128x128.png"), 128)
    salvar_png(icone, os.path.join(DIRETORIO_ICONES_DESKTOP, "128x128@2x.png"), 256)
    icone.save(os.path.join(DIRETORIO_ICONES_DESKTOP, "icon.ico"), format="ICO", sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    icone.save(os.path.join(DIRETORIO_ICONES_DESKTOP, "icon.icns"), format="ICNS")

    salvar_png(icone, os.path.join(DIRETORIO_ICONES_PWA, "icon-192.png"), 192)
    salvar_png(icone, os.path.join(DIRETORIO_ICONES_PWA, "icon-512.png"), 512)
    salvar_png(icone_maskable, os.path.join(DIRETORIO_ICONES_PWA, "icon-maskable-512.png"), 512)
    salvar_png(icone, os.path.join(DIRETORIO_ICONES_PWA, "apple-touch-icon.png"), 180)
    salvar_png(icone, os.path.join(DIRETORIO_ICONES_PWA, "favicon-32.png"), 32)
    salvar_png(desenhar_icone_dose_pediatrica(), os.path.join(DIRETORIO_ICONES_PWA, "atalho-dose-pediatrica-192.png"), 192)

    print("Ícones gerados em:", DIRETORIO_ICONES_DESKTOP, "e", DIRETORIO_ICONES_PWA)


if __name__ == "__main__":
    gerar_icones()
