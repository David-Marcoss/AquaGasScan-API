# AquaGasScan-API: serviço de leitura automatizada de consumo de água e gás
d
Teste Técnico – Desenvolvimento Web na https://landing.shopper.com.br/. O desafio consiste em desenvolver o back-end de um serviço que gerencia a leitura individualizada de consumo de água e gás. Para facilitar a coleta da informação, o serviço utilizará IA para
obter a medição através da foto de um medidor.


## Arquitetura da Aplicação

A arquitetura da aplicação é composta por uma API REST desenvolvida com o framework Express.js e um banco de dados para a persistência dos dados.

## Tecnologias Utilizadas no Projeto

### Back-end:
- TypeScript
- Express.js
- Prisma
- Gemini IA API 

### Banco de Dados:
- PostgreSQL

## Rodando o Projeto

### - Dependências

- É necessário ter o Node.js instalado no seu computador. Para instalar, acesse: [Instalar Node.js](https://nodejs.org/en/download/package-manager).

- Para executar o projeto é necessário ter o Docker e o Docker Compose instalados no seu computador. Para instalar, acesse: [Instalar Docker](https://docs.docker.com/engine/install/) e [Instalar Docker Compose](https://docs.docker.com/compose/install/).

- Também é necessário obter as credenciais de acesso ao **Gemini IA API**. Para isso, você pode acessar o site e seguir as instruções para obter a chave de API [Gemini-API](https://ai.google.dev/gemini-api/docs/api-key).

### Executando o Projeto

1. Crie um arquivo chamado **.env** na raiz do projeto, copie as variáveis do arquivo **.env.example** e cole no arquivo **.env**. Adicione a sua chave de API do Gemini IA:

    ```
    GEMINI_API_KEY= "YOUR_API_KEY"
    ```
2. Abra um terminal na pasta raiz do projeto e execute o seguinte comando:

    ```bash
    docker compose up --build
    ```

1. Se tudo ocorrer bem , a API estará disponível

    ```
    http://localhost:3000/
    ```

# API Documentation

## POST /upload

Endpoint responsável por receber uma imagem , consultar a API Gemini para extrair a medição do consumo de água ou gás, e retornar os dados processados.

### Request Body
Os dados devem ser enviados no formato **multipart/form-data**.

```json
{
  "image": "image",           
  "customer_code": "string",   
  "measure_datetime": "datetime",
  "measure_type": "WATER | GAS" 
}
```

### Responses

Status Code 200 - Sucesso

A operação foi realizada com sucesso, retornando o link da imagem temporária, o valor medido e um UUID exclusivo da medição.

```json
{
  "image_url": "string",        
  "measure_value": "integer",    
  "measure_uuid": "string"      
}
```

Status Code 400 - Dados Inválidos

Os dados fornecidos no corpo da requisição são inválidos.


```json
{
  "error_code": "INVALID_DATA",
  "error_description": "Descrição do erro detalhando os campos inválidos"
}
```

Status Code 409 - Duplicidade de Leitura

Já existe uma leitura registrada para este tipo de medição no mês atual.


```json
{
  "error_code": "DOUBLE_REPORT",
  "error_description": "Leitura do mês já realizada"
}
```

## PATCH /confirm

Endpoint responsável por confirmar ou corrigir o valor lido pelo LLM, salvando o novo valor informado no banco de dados.

### Request Body

```json
{
  "measure_uuid": "string", 
  "confirmed_value": "integer"
}
```

### Responses

Status Code 200 - Sucesso

A operação foi realizada com sucesso.

```json
{
  "success": true
}
```

Status Code 400 - Dados Inválidos

Os dados fornecidos no corpo da requisição são inválidos.

```json
{
  "error_code": "INVALID_DATA",
  "error_description": "Descrição detalhada dos campos inválidos"
}
```
Status Code 404 - Leitura Não Encontrada

O código de leitura informado não foi encontrado.

```json
{
  "error_code": "MEASURE_NOT_FOUND",
  "error_description": "Leitura não encontrada"
}
```
Status Code 409 - Leitura Já Confirmada

A leitura já foi confirmada anteriormente.

```json
{
  "error_code": "CONFIRMATION_DUPLICATE",
  "error_description": "Leitura já confirmada"
}
```

## GET /<customer_code>/list

Endpoint responsável por listar as medições realizadas por um determinado cliente.

### Query Parameters

- `measure_type` (opcional): Deve ser `WATER` ou `GAS` (não diferencia maiúsculas e minúsculas). Se informado, filtra apenas os valores do tipo especificado; caso contrário, retorna todos os tipos.

### Exemplo de URL

```
{base url}/<customer code>/list?measure_type=WATER
```

### Responses

#### Status Code 200 - Sucesso

A operação foi realizada com sucesso, retornando uma lista com todas as leituras realizadas pelo cliente.

```json
{
  "customer_code": "string",
  "measures": [
    {
      "measure_uuid": "string", 
      "measure_datetime": "datetime",
      "measure_type": "string",   
      "has_confirmed": "boolean",   
      "image_url": "string"       
    },
    {
      "measure_uuid": "string",
      "measure_datetime": "datetime",
      "measure_type": "string",
      "has_confirmed": "boolean",
      "image_url": "string"
    }
  ]
}
```

Status Code 400 - Parâmetro Inválido

O parâmetro measure_type fornecido é inválido, diferente de WATER ou GAS.

```json
{
  "error_code": "INVALID_TYPE",
  "error_description": "Tipo de medição não permitida"
}
```

Status Code 404 - Nenhum Registro Encontrado

Nenhuma medição foi encontrada para o cliente.

```json
{
  "error_code": "MEASURES_NOT_FOUND",
  "error_description": "Nenhuma leitura encontrada"
}
```
