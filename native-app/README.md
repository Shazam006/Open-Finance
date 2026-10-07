# Open Finance: projeto de aplicativo iOS e Android

Esta pasta contém os projetos nativos gerados com Capacitor, a mesma interface e as mesmas regras financeiras usadas no notebook. O conteúdo é empacotado no aplicativo; a execução não depende de um site hospedado.

**Estado:** compilação iOS concluída com sucesso no Xcode do GitHub em 07/10/2026. O IPA sem assinatura está em `../iphone/Open-Finance-sem-zoom.ipa`. Os testes de persistência passaram. A assinatura com a conta do usuário e a instalação pelo Sideloadly terminaram com **Done, 100%** no iPhone com iOS 27.0. O projeto Android foi gerado, mas ainda não foi compilado pelo Gradle. O usuário confirmou a abertura e a preservação dos dados no iPhone. A atualização para impedir o zoom automático foi instalada com Done, 100%, e o comportamento ao digitar foi confirmado pelo usuário no iPhone.

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

Sem Mac próprio, o arquivo `.github/workflows/open-finance-ios.yml` no projeto principal prepara a compilação em um runner macOS do GitHub. Ele foi publicado no repositório [Shazam006/Open-Finance](https://github.com/Shazam006/Open-Finance) e executado com sucesso. Ele não usa senha Apple, certificado de distribuição nem assinatura paga. Ao concluir, gera um IPA sem assinatura que precisa ser assinado no Sideloadly ou SideStore antes de ser instalado. [Resultado da compilação validada](https://github.com/Shazam006/Open-Finance/actions/runs/37640470168).

Para gerar manualmente o mesmo pacote em um Mac, após preparar e sincronizar:

```sh
node scripts/build-ios-unsigned.mjs
```

Resultado esperado da compilação manual: `build/Open-Finance-sem-assinatura.ipa`. Um IPA sem assinatura não instala diretamente pelo Safari.

## TestFlight ou App Store

Quem publica precisa de uma conta ativa no Apple Developer Program. No Xcode, configure a equipe e a assinatura, gere Archive e distribua ao App Store Connect. Será necessário completar os dados do app e as revisões aplicáveis. Quem recebe o aplicativo não precisa assinar o programa. [Apple: distribuição](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases).

## Android

Abra a pasta `android` no Android Studio, configure o SDK e compile um APK de teste. Para distribuir uma versão final, gere um APK assinado e preserve a chave para futuras atualizações. A publicação na Play Store é um processo separado. Os arquivos Android foram gerados, mas nenhum APK foi compilado nesta máquina.

## Dados e backup

Os lançamentos são gravados em arquivos do armazenamento do aplicativo com o plugin Filesystem. Duas versões alternadas protegem contra uma gravação truncada; uma falha de leitura bloqueia o salvamento para evitar sobrescrever dados. Isso não substitui backups externos. A abertura e a preservação dos dados após fechar e reabrir foram confirmadas pelo usuário no iPhone com iOS 27.0; o armazenamento no Android ainda precisa ser verificado em um aparelho.

Em Ajustes, Salvar backup abre o compartilhamento nativo para você escolher Arquivos, Drive ou outro destino disponível. Restaurar backup aceita os mesmos arquivos JSON da versão para notebook. A restauração substitui os registros atuais após confirmação. Esta versão não sincroniza automaticamente entre notebook, iPhone e Android.

Desinstalar o aplicativo pode apagar seus dados locais. Salve um backup antes de reinstalar ou trocar de aparelho. Durante uma atualização, preserve o identificador do app e as credenciais de assinatura. O pacote contém código e ícones, sem registros financeiros de usuários.

O manifesto de privacidade iOS inclui a declaração FileTimestamp exigida pelo Filesystem. Revise o relatório de privacidade do Archive antes de enviar à Apple. [Capacitor Filesystem](https://capacitorjs.com/docs/apis/filesystem).

Veja `INSTALACAO-IPHONE-ALTERNATIVAS.md` na pasta principal para comparar os caminhos de instalação.

## Atualização de 07/10/2026: campos no iPhone

A atualização para impedir o zoom automático foi instalada com Done, 100%, e o comportamento ao digitar foi confirmado pelo usuário no iPhone.

Os campos `input`, `select` e `textarea` usam fonte de 16 px em `app/globals.css`, impedindo que o tamanho pequeno do texto acione o zoom automático ao rece…225 tokens truncated…eceu o iPhone com iOS 27.0 pelo Sideloadly. A instalação terminou com **Done, 100%** no Sideloadly. O usuário confirmou a abertura e a preservação dos dados no iPhone. A atualização para impedir o zoom automático foi instalada com Done, 100%, e o comportamento ao digitar foi confirmado pelo usuário no iPhone.

## Arquivos

- Aplicativo: `D:\APP\Open Finance\iphone\Open-Finance-sem-zoom.ipa`
- Sideloadly: `D:\APP\Open Finance\ferramentas\Sideloadly\sideloadly.exe`
- Código: https://github.com/Shazam006/Open-Finance
- Compilação: https://github.com/Shazam006/Open-Finance/actions/runs/37640470168

## Instalar

1. Conecte o iPhone por USB, desbloqueie e escolha Confiar no computador, se solicitado.
2. No Sideloadly, selecione seu iPhone e o arquivo IPA acima. Preencha Apple ID, clique em Start e informe a senha e os códigos de verificação diretamente no programa.
3. Aguarde Done. Se aparecer um erro, mantenha a janela aberta e copie apenas a mensagem do erro.
4. Se o iPhone pedir confiança no desenvolvedor, vá a Ajustes > Geral > VPN e Gerenciamento de Dispositivo. Abra o perfil da conta usada para assinar o app e confirme a confiança.
5. Se o iPhone pedir Modo de Desenvolvedor, siga Ajustes > Privacidade e Segurança > Modo de Desenvolvedor e as instruções de reinício e confirmação no aparelho. Ative apenas se necessário para este aplicativo.
6. Abra Open Finance e confirme que a tela inicial aparece. Faça um lançamento pequeno para conferir o salvamento, feche e reabra o aplicativo.

As credenciais Apple ficam sob seu controle. Nunca envie senha ou código de verificação pelo chat. Não é necessário assinar o Apple Developer Program pago para este caminho.

## Renovar e preservar os dados

A conta gratuita exige renovar a assinatura a cada sete dias. Antes de vencer, conecte o iPhone ao notebook e instale novamente o mesmo IPA com a mesma conta Apple, mantendo o identificador do aplicativo. Evite desinstalar: a remoção pode apagar os dados locais. Salve backups externos em Ajustes > Salvar backup dentro do Open Finance.

O Sideloadly também oferece renovação automática pelo daemon quando o notebook está ligado e consegue acessar o iPhone por USB ou Wi-Fi. A renovação por Wi-Fi exige configuração prévia. A versão atual não sincroniza seus lançamentos automaticamente entre notebook e celular.

Fonte: [FAQ oficial do Sideloadly](https://sideloadly.io/faq).

## Atualização de 07/10/2026: campos no iPhone

A atualização para impedir o zoom automático foi instalada com Done, 100%, e o comportamento ao digitar foi confirmado pelo usuário no iPhone.

Os campos `input`, `select` e `textarea` usam fonte de 16 px em `app/globals.css`, impedindo que o tamanho pequeno do texto acione o zoom automático ao receber foco. O zoom manual permanece disponível. A alteração foi incluída na versão do notebook, no pacote web para celular e nos projetos nativos iOS e Android.

O teste local confirmou 16 px nos campos de Saldos e Ajustes. O IPA entregue foi verificado e contém a mesma regra. A correção anterior da tela branca permanece em `native-app/scripts/build.mjs`; a abertura e o salvamento dessa versão foram confirmados por você no aparelho.

Arquivo atual: `D:\APP\Open Finance\iphone\Open-Finance-sem-zoom.ipa`. Para atualizar e renovar, use a mesma conta Apple e mantenha o aplicativo instalado. Compilação: https://github.com/Shazam006/Open-Finance/actions/runs/37640470168.
