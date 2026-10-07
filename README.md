# Open Finance

Aplicativo pessoal em português para controlar saldos, contas, vencimentos e pagamentos. Inclui salário no quinto dia útil, adiantamento no dia 20 e duas parcelas do 13º. Os dados ficam no aparelho e podem ser exportados e restaurados por backup JSON.

Este repositório contém o projeto nativo iPhone/Android e a interface compartilhada. Não contém registros financeiros de usuários nem credenciais Apple. A publicação e instalação precisam da assinatura correspondente.

## Compilar

Em `native-app`, execute `npm ci`, `npm run verify`, `npm run build` e `npx cap sync`. Consulte [o guia do projeto nativo](native-app/README.md).

O workflow **Gerar Open Finance para iPhone** compila no macOS do GitHub e entrega o artefato **Open-Finance-iPhone-sem-assinatura**. O IPA precisa ser assinado antes da instalação. Com uma conta Apple gratuita, a assinatura para uso pessoal precisa ser renovada a cada sete dias.

Requisitos: Node.js 22.13+, Xcode 26+ para compilar iOS, iOS 17+ no aparelho. Android 7+ com WebView atualizado.

## Versão verificada no iPhone

A compilação de 07/10/2026 foi instalada pelo Sideloadly no iPhone com iOS 27.0. A abertura e a preservação dos dados foram confirmadas pelo usuário. Os campos foram ajustados para 16 px e o usuário confirmou que o zoom automático ao digitar parou. [Compilação da correção](https://github.com/Shazam006/Open-Finance/actions/runs/37640470168).
