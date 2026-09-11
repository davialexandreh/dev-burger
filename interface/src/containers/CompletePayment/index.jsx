import { useEffect, useState } from 'react';

import { useStripe } from '@stripe/react-stripe-js';

const SuccessIcon = (
  <svg
    width="16"
    height="14"
    viewBox="0 0 16 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.4695 0.232963C15.8241 0.561287 15.8444 1.1149 15.516 1.46948L6.5999 11.4848C6.36735 11.7398 6.00783 11.841 5.67584 11.74L2.22394 10.4771C1.8776 10.363 1.68819 9.96841 1.80013 9.62307C1.91205 9.27686 2.30832 9.09061 2.65466 9.2047L5.25974 10.1606L14.0741 0.358224C14.4025 0.00364396 14.9561 -0.0954808 15.4695 0.232963Z"
      fill="white"
    />
  </svg>
);

const STATUS_LABEL = {
  succeeded: 'aprovado',
  processing: 'em processamento',
  requires_payment_method: 'recusado',
  default: 'desconhecido',
};

const STATUS_CONTENT_MAP = {
  succeeded: {
    text: 'Pagamento Efetuado com sucesso',
    iconColor: '#30B130',
    icon: SuccessIcon,
    buttonText: 'Voltar para a loja',
    url: '/',
  },
  processing: {
    text: 'Pagamento em Processamento',
    iconColor: '#6D6E78',
    icon: SuccessIcon,
    buttonText: 'Voltar para a loja',
    url: '/',
  },
  requires_payment_method: {
    text: 'Falha no pagamento tente novamente',
    iconColor: '#DF1B41',
    icon: SuccessIcon,
    buttonText: 'Tentar novamente',
    url: '/carrinho',
  },
  default: {
    text: 'Algo deu errado, tente novamente',
    iconColor: '#DF1B41',
    icon: SuccessIcon,
    buttonText: 'Voltar para a loja',
    url: '/',
  },
};

export function CompletePayment() {
  const stripe = useStripe();

  const [status, setStatus] = useState('default');
  const [intentId, setIntentId] = useState(null);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret',
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) {
        return;
      }

      setStatus(paymentIntent.status);
      setIntentId(paymentIntent.id);
    });
  }, [stripe]);

  return (
    <div className="container">
      <div id="payment-status">
        <div
          id="status-icon"
          style={{ backgroundColor: STATUS_CONTENT_MAP[status].iconColor }}
        >
          {STATUS_CONTENT_MAP[status].icon}
        </div>
        <h2 id="status-text" className="status-title">
          {STATUS_CONTENT_MAP[status].text}
        </h2>
        {intentId && (
          <div id="details-table">
            <table>
              <tbody>
                <tr>
                  <td className="TableLabel">código</td>
                  <td id="intent-id" className="TableContent">
                    {intentId}
                  </td>
                </tr>
                <tr>
                  <td className="TableLabel">pagamento</td>
                  <td id="intent-status" className="TableContent">
                    {STATUS_LABEL[status] || STATUS_LABEL.default}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <a id="retry-button" href={STATUS_CONTENT_MAP[status].url}>
          {STATUS_CONTENT_MAP[status].buttonText}
        </a>
      </div>
    </div>
  );
}
