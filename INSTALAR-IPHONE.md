# Instalar o Open Finance no iPhone pelo Windows

O aplicativo foi compilado pelo Xcode no GitHub em 07/10/2026. O notebook reconheceu o iPhone com iOS 27.0 pelo Sideloadly. A instalação terminou com **Done, 100%** no Sideloadly. O usuário confirmou a abertura e a preservação dos dados no iPhone. A atualização para impedir o zoom automático foi instalada com Done, 100%, e o comportamento ao digitar foi confirmado pelo usuário no iPhone.

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

