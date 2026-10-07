# Open Finance: projeto de aplicativo iOS e Android

Esta pasta contém os projetos nativos gerados com Capacitor, a mesma interface e as mesmas regras financeiras usadas no notebook. O conteúdo é empacotado no aplicativo; a execução não depende de um site hospedado.

**Estado:** compilação iOS concluída com sucesso no Xcode do GitHub em 07/10/2026. O IPA sem assinatura está em `../iphone/Open-Finance-sem-assinatura.ipa`. Os testes de persistência passaram. A assinatura e a instalação pelo Sideloadly ainda dependem da autenticação do usuário. O projeto Android foi gerado, mas ainda não foi compilado pelo Gradle. A execução em aparelhos físicos ainda precisa ser confirmada.

Requisitos do projeto: iOS 17 ou posterior; Android 7 ou posterior com Android System WebView atualizado. A compilação iOS exige macOS e Xcode 26 ou posterior. Consulte [Capacitor iOS](https://capacitorjs.com/docs/ios) e [configuração do ambiente](https://capacitorjs.com/docs/getting-started/environment-setup).

## Preparação

Copie o projeto inteiro, incluindo as pastas `app`, `lib`, `preview` e `public`, para o computador de compilação. Em `native-app`:

```sh
npm ci
npm run verify
npm run build
npx cap sync
```

Node.js 22.13 ou posterior é necessário. `package-lock.json` fixa as versões das dependências. O identificador configurado é `br.com.pedro.openfinance`; a disponibilidade para publicação não foi registrada nem verificada.

## iPhone sem assinatura paga

Com um Mac, abra `ios/App/App.xcodeproj` no Xcode, adicione sua conta Apple e selecione Personal Team em Signing & Capabilities. Conecte seu iPhone, selecione-o como destino e execute o projeto. A instalação gratuita precisa ser renovada em 7 dias. [Apple: Personal Team](https://developer.apple.com/help/account/basics/about-your-developer-account).

Sem Mac próprio, o arquivo `.github/workflows/open-finance-ios.yml` no projeto principal prepara a compilação em um runner macOS do GitHub. Ele foi publicado no repositório [Shazam006/Open-Finance](https://github.com/Shazam006/Open-Finance) e executado com sucesso. Ele não usa senha Apple, certificado de distribuição nem assinatura paga. Ao concluir, gera um IPA sem assinatura que precisa ser assinado no Sideloadly ou SideStore antes de ser instalado. [Resultado da compilação validada](https://github.com/Shazam006/Open-Finance/actions/runs/37635627288).

Para gerar manualmente o mesmo pacote em um Mac, após preparar e sincronizar:

```sh
node scripts/build-ios-unsigned.mjs
```

Resultado esperado: `build/Open-Finance-sem-assinatura.ipa`. Um IPA sem assinatura não instala diretamente pelo Safari.

## TestFlight ou App Store

Quem publica precisa de uma conta ativa no Apple Developer Program. No Xcode, configure a equipe e a assinatura, gere Archive e distribua ao App Store Connect. Será necessário completar os dados do app e as revisões aplicáveis. Quem recebe o aplicativo não precisa assinar o programa. [Apple: distribuição](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases).

## Android

Abra a pasta `android` no Android Studio, configure o SDK e compile um APK de teste. Para distribuir uma versão final, gere um APK assinado e preserve a chave para futuras atualizações. A publicação na Play Store é um processo separado. Os arquivos Android foram gerados, mas nenhum APK foi compilado nesta máquina.

## Dados e backup

Os lançamentos são gravados em arquivos do armazenamento do aplicativo com o plugin Filesystem. Duas versões alternadas protegem contra uma gravação truncada; uma falha de leitura bloqueia o salvamento para evitar sobrescrever dados. Isso não substitui backups externos. A integração com os sistemas de arquivos reais ainda precisa ser testada em aparelhos.

Em Ajustes, Salvar backup abre o compartilhamento nativo para você escolher Arquivos, Drive ou outro destino disponível. Restaurar backup aceita os mesmos arquivos JSON da versão para notebook. A restauração substitui os registros atuais após confirmação. Esta versão não sincroniza automaticamente entre notebook, iPhone e Android.

Desinstalar o aplicativo pode apagar seus dados locais. Salve um backup antes de reinstalar ou trocar de aparelho. Durante uma atualização, preserve o identificador do app e as credenciais de assinatura. O pacote contém código e ícones, sem registros financeiros de usuários.

O manifesto de privacidade iOS inclui a declaração FileTimestamp exigida pelo Filesystem. Revise o relatório de privacidade do Archive antes de enviar à Apple. [Capacitor Filesystem](https://capacitorjs.com/docs/apis/filesystem).

Veja `INSTALACAO-IPHONE-ALTERNATIVAS.md` na pasta principal para comparar os caminhos de instalação.
