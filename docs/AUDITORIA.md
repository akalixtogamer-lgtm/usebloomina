# Bloomina · Auditoria e redesign da página inicial

Data: 19/10/2026 · Escopo: `index.html` (vitrine). A apresentação (`apresentacao/`) continua usando os mesmos tokens e não foi redesenhada.

## 1. Linha de base (antes)

**Tecnologia.** Site estático publicado no GitHub Pages: HTML, CSS e JavaScript sem framework e sem build. Não há API, catálogo dinâmico, carrinho, conta, newsletter nem integração de pagamento. O único canal comercial real é o WhatsApp (21 98126-4144) e o Instagram (@usebloomina.semijoias).

**Arquivos.** `index.html` (página), `assets/bloomina.css` (tokens + componentes, compartilhado com a apresentação), `assets/fonts/` (Cormorant Garamond e Jost, OFL), `assets/pecas/*.svg` (6 ilustrações de peças fictícias), `assets/fotos/` (fotos reais da banca), `assets/logo-avatar.png` (logo real, recortado do perfil do Instagram).

**Funcionalidades existentes (preservadas):** troca de tema Pérola/Noite com memória no navegador; filtro por categoria; botões de pedido pelo WhatsApp com mensagem pronta; link para a apresentação.

**Medições automáticas (Playwright + axe-core 4.10, 320–1440 px):** sem rolagem horizontal; sem erros de console; 0 violações automáticas no axe; 1 `h1`; hierarquia de títulos correta. Porém: 15 imagens sem dimensões declaradas; links "Quero essa" com 16 px de altura (abaixo do mínimo de 24 px da WCAG 2.2, critério 2.5.8); **abaixo de 860 px o menu some e não há alternativa**.

### O que as referências mostram (só o que foi possível verificar)

| Referência | Acesso | Princípio aproveitado |
|---|---|---|
| Bond AI | texto da página | Categorias e "ver todos" no menu; cartão com metal/variação, preço e ação direta. Alerta: excesso de selos, cupons e itens esgotados polui a vitrine. |
| Piuka | texto da página | Categorias em blocos logo no início; busca no cabeçalho; produto com material no nome. |
| Rommanel | texto da página | Ordenação explícita (preço, nome); guia de cuidados e garantia como links de confiança; rodapé institucional organizado. |
| Dama Semijoias | texto da página | "Espiar" (visualização rápida) no cartão; WhatsApp como canal de venda e pós-venda; rodapé em grupos (Institucional, Ajuda, Contato). Alerta: selos "0% OFF" e "R$0,00" minam a confiança. |
| Lazzuli | texto parcial | Página de produto com material no título e galeria; o restante não foi capturado. |
| Hector Albertazzi | texto da página | Coleções com nome e imagem própria; títulos de seção em caixa-alta; produto com acabamento do metal. |
| Vivara | só metadados | Não foi possível ver o conteúdo. Nenhuma observação visual feita. |
| Francisca Joias | falhou | Não foi possível acessar. Nenhuma observação feita. |

Nenhum layout, texto ou imagem das referências foi copiado.

## 2. Matriz de auditoria

| # | Problema | Gravidade | Impacto | Esforço | Correção aplicada |
|---|---|---|---|---|---|
| 1 | Abaixo de 860 px o menu desaparece; no celular não há navegação nem botão de WhatsApp no topo | Crítica | Usabilidade, conversão | Médio | Menu móvel com botão acessível (`aria-expanded`, Esc fecha, foco volta ao botão) e atalho de WhatsApp sempre visível |
| 2 | Informações comerciais inventadas na vitrine: parcelamento "3x de R$ 32,33", "Coleção Primavera", selos "Novidade" e "Últimas peças", frase "Testamos o banho, o fecho e o conforto" | Crítica | Confiança | Pequeno | Removidas. Parcelamento, coleção e estoque só voltam com dados reais. A vitrine é marcada como demonstração |
| 3 | Cartão cobre ~35% da joia com o painel de vidro | Alta | Identidade, conversão | Médio | Cartão editorial: imagem protagonista, informações abaixo da imagem |
| 4 | Vidro e aquarela em quase todas as seções | Alta | Identidade | Pequeno | Vidro só no cabeçalho fixo e no painel de detalhes; aquarela só como assinatura no hero |
| 5 | Sem busca, sem ordenação e sem estado vazio na vitrine | Alta | Conversão | Médio | Busca por nome/material, ordenação por preço e nome, contagem anunciada a leitores de tela, estado vazio com "Limpar filtros" |
| 6 | Sem detalhe de produto: a única ação é ir direto ao WhatsApp | Alta | Conversão | Médio | Botão "Ver detalhes" abre `<dialog>` nativo com imagem ampliada, material, descrição, cuidados e pedido pelo WhatsApp |
| 7 | Alvos de toque de 16 px ("Quero essa", links do menu) | Alta | Acessibilidade (2.5.8) | Pequeno | Todos os controles com no mínimo 44 px de altura |
| 8 | Categorias são só botões de filtro, sem link compartilhável | Média | Usabilidade, SEO | Pequeno | Categorias viram links reais (`?categoria=brincos#pecas`); o filtro atualiza o endereço |
| 9 | Sem link "pular para o conteúdo" | Média | Acessibilidade (2.4.1) | Pequeno | Link de pular adicionado |
| 10 | 15 imagens sem `width`/`height`; foto de 392 KB carregada no início | Média | Desempenho (CLS, LCP) | Pequeno | Dimensões declaradas, `loading="lazy"` abaixo da dobra, foto em WebP com JPG de reserva, fontes principais pré-carregadas |
| 11 | Sem canonical, Open Graph e dados da organização | Média | SEO, compartilhamento | Pequeno | Canonical, Open Graph com imagem própria, JSON-LD de Organization só com dados reais (nome, Instagram, telefone) |
| 12 | Não explica como comprar nem onde ficam pagamento, entrega e trocas | Média | Confiança | Pequeno | Seção "Como comprar" honesta: escolha → WhatsApp → combinar pagamento e entrega. Políticas não foram inventadas |
| 13 | Ícone/miniatura do anel repetido em "Todas" e "Anéis" | Baixa | Identidade | Pequeno | Categorias com imagem própria cada |
| 14 | Rodapé com uma linha só | Baixa | Confiança | Pequeno | Rodapé em grupos: Bloomina, Navegue, Atendimento, Sobre esta página |
| 15 | Faltam tokens de feedback (sucesso, aviso, erro) e de layout | Baixa | Manutenção | Pequeno | Tokens adicionados em `bloomina.css` |

## 3. Pendências que dependem da Bloomina

- **Catálogo real:** nomes, preços, materiais e fotos das peças. Hoje as 8 peças são fictícias e estão sinalizadas.
- **Fotografia de produto:** a vitrine usa ilustrações. Fotos reais em fundo neutro (mínimo 1200 px) vão elevar muito a percepção de valor.
- **Políticas:** formas de pagamento, parcelamento, frete/entrega, trocas e garantia. Nada disso foi publicado porque não foi informado.
- **Logo em vetor:** o logo atual é um recorte do avatar do Instagram (360 px).
- **Newsletter:** não implementada, porque não há serviço de e-mail. O relacionamento está direcionado ao Instagram e ao WhatsApp.
- **Carrinho e checkout:** não existem e não foram simulados. A compra acontece pelo WhatsApp.

## 4. Direção de arte aplicada

- **Editorial e limpo:** fundo pérola, tons de linho, texto no marrom do logo e o ouro só nas ações (botão principal, preço, filetes). Aquarela rosa/lilás aparece uma vez, atrás da peça do hero, como assinatura da marca.
- **A peça é a protagonista:** cartões sem sobreposição; imagem 4:5 em fundo de linho, informação abaixo.
- **Vidro com propósito:** só no cabeçalho fixo (deixa ver o conteúdo ao rolar) e no fundo do painel de detalhes.
- **Tipografia:** Cormorant Garamond para títulos, nomes e preços; Jost para navegação, textos e botões. Corpo em 17 px.
- **Mensagem:** "Floresça no seu estilo" é a assinatura real da marca (placa da banca e bio do Instagram), não um slogan novo.

## 5. Design system v2 (em `assets/bloomina.css`)

Tokens novos, sem quebrar os existentes nem a apresentação: `--bg`, `--bg-alt`, `--surface`, `--border`, `--border-strong`, `--success`/`--success-bg`, `--warning`/`--warning-bg`, `--error`/`--error-bg`, `--focus-ring`, `--container` (1200 px), `--gutter`, `--section-y`, escala `--text-xs` a `--text-l`, `--leading-body`, `--duration`, `--ease`, `--target` (44 px). Todos com valor para o tema Pérola e Noite de gala.

Componentes novos: campo (`.bl-field`, `.bl-input`, `.bl-select`, com estados hover, foco e `aria-invalid`), botão contorno (`.bl-btn--line`), estados `disabled` e `aria-busy`, mensagens `.bl-status--success|warning|error`. Os componentes da vitrine ficam em `assets/site.css` e o comportamento em `assets/site.js` (sem dependências).

Contraste dos tokens novos (WCAG): sucesso 5,4:1, aviso 5,2:1, erro 5,6:1 no claro; 7,5–8,2:1 no escuro. Borda de controles 3,6–4:1 no claro e 6,2:1 no escuro.

## 6. Testes executados (19/10/2026)

Ferramentas: Playwright (Chromium) com servidor local, axe-core 4.10.2 e um verificador de contraste por estilo calculado. **75 verificações, 75 passaram.**

- **Responsivo** (320, 375, 390, 768, 1024, 1440 px): sem rolagem horizontal, sem erro de console, sem requisição com falha, todos os alvos ≥ 24 px (botões e campos têm 44 px), menu certo em cada largura.
- **Teclado:** link de pular é o primeiro Tab e leva ao conteúdo; menu móvel abre, move o foco, fecha com Esc e devolve o foco; painel de detalhes abre com foco no Fechar, fecha com Esc e devolve o foco ao botão de origem.
- **Vitrine:** filtro por categoria, contagem anunciada (`role="status"`), endereço atualizado, busca com e sem acento, estado vazio e "Limpar filtros", ordenação por preço e nome, links de categoria e link direto `?categoria=pulseiras`.
- **Preservado:** tema escuro e memória do tema, 14 links de WhatsApp com o número real, links internos (apresentação e PDF) com status 200, apresentação abre e navega sem erros.
- **Sem JavaScript:** as 8 peças continuam visíveis.
- **Movimento reduzido:** rolagem suave desligada.
- **axe-core:** 0 violações no claro, no escuro, com menu aberto e com o painel aberto. Itens marcados para revisão manual (texto sobre o cabeçalho translúcido) foram conferidos: texto `ink` sobre pérola, 13,7:1.
- **Contraste calculado:** todos os textos passam no tema escuro; no claro, os dois avisos são falsos positivos do cálculo sobre `color-mix` do cabeçalho (o texto real é `ink` sobre pérola).

**Não medido:** Core Web Vitals de campo (o site não tem dados de uso). Não foi feito teste com leitor de tela real. Isso não é declaração de conformidade total com a WCAG.
