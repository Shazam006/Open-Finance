# Instalar o Open Finance no iPhone pelo Windows

O aplicativo foi compilado pelo Xcode no GitHub em 07/10/2026. O notebook reconheceu o iPhone com iOS 27.0 pelo Sideloadly. A instalação ainda precisa terminar e a abertura no aparelho precisa ser confirmada.

## Arquivos

- Aplicativo: `D:\APP\Open Finance\iphone\Open-Finance-sem-assinatura.ipa`
- Sideloadly: `D:\APP\Open Finance\ferramentas\Sideloadly\sideloadly.exe`
- Código: https://github.com/Shazam006/Open-Finance
- Compilação: https://github.com/Shazam006/Open-Finance/actions/runs/37635627288

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
