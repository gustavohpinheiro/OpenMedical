"""
Gera os ícones do app Android a partir do mesmo desenho do atalho "Dose infantil" do app principal
(core_rust/openclinical_desktop/gerar_icones.py): mudou lá, roda este script e o APK acompanha.
"""

import os
import sys

from PIL import Image, ImageDraw

DIRETORIO_APP = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.join(DIRETORIO_APP, "..", "core_rust", "openclinical_desktop"))

from gerar_icones import desenhar_icone_dose_pediatrica  # noqa: E402

DIRETORIO_RES = os.path.join(DIRETORIO_APP, "android", "app", "src", "main", "res")

# Ícone tradicional em 48 dp; camada do ícone adaptativo em 108 dp (conteúdo visível nos 72 dp centrais)
DENSIDADES = {"mdpi": 1.0, "hdpi": 1.5, "xhdpi": 2.0, "xxhdpi": 3.0, "xxxhdpi": 4.0}


def recorte_redondo(imagem: Image.Image) -> Image.Image:
    mascara = Image.new("L", imagem.size, 0)
    ImageDraw.Draw(mascara).ellipse([0, 0, imagem.width - 1, imagem.height - 1], fill=255)
    redondo = Image.new("RGBA", imagem.size, (0, 0, 0, 0))
    redondo.paste(imagem, (0, 0), mascara)
    return redondo


def gerar() -> None:
    icone = desenhar_icone_dose_pediatrica()
    icone_redondo = recorte_redondo(desenhar_icone_dose_pediatrica(margem_segura=0.12))
    # 72/108 do canvas fica visível na máscara do launcher; a margem deixa o selo "+" dentro dela
    camada_adaptativa = desenhar_icone_dose_pediatrica(margem_segura=0.4)

    for densidade, fator in DENSIDADES.items():
        pasta = os.path.join(DIRETORIO_RES, f"mipmap-{densidade}")
        os.makedirs(pasta, exist_ok=True)
        tamanho = round(48 * fator)
        icone.resize((tamanho, tamanho), Image.LANCZOS).save(os.path.join(pasta, "ic_launcher.png"))
        icone_redondo.resize((tamanho, tamanho), Image.LANCZOS).save(os.path.join(pasta, "ic_launcher_round.png"))
        camada = round(108 * fator)
        camada_adaptativa.resize((camada, camada), Image.LANCZOS).save(os.path.join(pasta, "ic_launcher_foreground.png"))

    print("Ícones Android gerados em", DIRETORIO_RES)


if __name__ == "__main__":
    gerar()
