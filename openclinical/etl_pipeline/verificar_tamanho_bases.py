import urllib.request

urls = [
    "https://dados.anvisa.gov.br/dados/DADOS_ABERTOS_MEDICAMENTOS.csv",
    "https://dados.anvisa.gov.br/dados/TA_PRECO_MEDICAMENTO.csv",
    "https://s3.sa-east-1.amazonaws.com/ckan.saude.gov.br/CONITEC/csv/pcdt.csv.zip"
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) OpenClinical/1.0"
}

for url in urls:
    try:
        req = urllib.request.Request(url, headers=headers, method="HEAD")
        with urllib.request.urlopen(req, timeout=15) as resp:
            tamanho = resp.headers.get("Content-Length")
            tipo = resp.headers.get("Content-Type")
            if tamanho:
                tamanho_mb = int(tamanho) / (1024 * 1024)
                print(f"URL: {url} -> Tamanho: {tamanho_mb:.2f} MB ({tipo})")
            else:
                print(f"URL: {url} -> Tamanho desconhecido ({tipo})")
    except Exception as e:
        print(f"URL: {url} -> Erro HEAD ({e}), tentando GET...")
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as resp:
                tamanho = resp.headers.get("Content-Length")
                if tamanho:
                    print(f"GET URL: {url} -> Tamanho: {int(tamanho)/(1024*1024):.2f} MB")
                else:
                    print(f"GET URL: {url} -> Sem content-length")
        except Exception as e2:
            print(f"GET URL: {url} -> Falhou: {e2}")
