import os
import struct

diretorio_icones = os.path.join(os.path.dirname(__file__), "icons")
os.makedirs(diretorio_icones, exist_ok=True)

# 1x1 transparent/teal PNG mínimo válido
PNG_BYTES = bytes([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00, 0x20,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x73, 0x7A, 0x7A,
    0xF4, 0x00, 0x00, 0x00, 0x1B, 0x49, 0x44, 0x41,
    0x54, 0x78, 0x9C, 0x63, 0x60, 0x18, 0x05, 0xA3,
    0x60, 0x14, 0x8C, 0x82, 0x51, 0x30, 0x28, 0x18,
    0x05, 0xA3, 0x60, 0x14, 0x00, 0x00, 0x2E, 0x90,
    0x03, 0xC1, 0x86, 0x53, 0x99, 0x5C, 0x00, 0x00,
    0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42,
    0x60, 0x82
])

with open(os.path.join(diretorio_icones, "32x32.png"), "wb") as f:
    f.write(PNG_BYTES)

with open(os.path.join(diretorio_icones, "128x128.png"), "wb") as f:
    f.write(PNG_BYTES)

with open(os.path.join(diretorio_icones, "128x128@2x.png"), "wb") as f:
    f.write(PNG_BYTES)

with open(os.path.join(diretorio_icones, "icon.icns"), "wb") as f:
    f.write(PNG_BYTES)

# Criação de ICO válido encapsulando o PNG
# Header ICO: 2 bytes reservados (0), 2 bytes tipo (1 = icon), 2 bytes contagem de imagens (1)
ico_header = struct.pack("<HHH", 0, 1, 1)
# Directory Entry (16 bytes): largura (32), altura (32), cores (0), reservado (0), planos (1), bpp (32), tamanho dos dados, offset (22)
png_len = len(PNG_BYTES)
ico_entry = struct.pack("<BBBBHHII", 32, 32, 0, 0, 1, 32, png_len, 22)

with open(os.path.join(diretorio_icones, "icon.ico"), "wb") as f:
    f.write(ico_header + ico_entry + PNG_BYTES)

print("Ícones gerados com sucesso em:", diretorio_icones)
