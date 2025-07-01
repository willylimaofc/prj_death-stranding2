Cypress.on('uncaught:exception', (err, runnable) => {
  return false; // ignora erros de terceiros
});

describe('Scraping de preços - Death Stranding 2 PS5 (mídia física)', () => {
  const resultadosColetados = [];

  const lojas = [
    {
      nome: 'Amazon',
      url: 'https://www.amazon.com.br',
      seletor: '#twotabsearchtextbox',
      botao: '#nav-search-submit-button',
      resultado: 'span.a-text-normal',
      preco: 'span.a-price > span.a-offscreen'
    },
    {
      nome: 'Kabum',
      url: 'https://www.kabum.com.br',
      seletor: 'input[placeholder="Busque no KaBuM!"]',
      botao: 'button[type="submit"]',
      resultado: '.productCard .nameCard',
      preco: '.productCard .priceCard',
      timeout: 120000
    },
    {
      nome: 'Submarino',
      url: 'https://www.submarino.com.br/busca/death-stranding-2-ps5',
      resultado: 'h3[class*=product-name]',
      preco: 'span[class*=sales-price]',
      direto: true
    },
    {
      nome: 'Americanas',
      url: 'https://www.americanas.com.br/busca/death-stranding-2-ps5',
      resultado: 'h3[class*=product-name]',
      preco: 'span[class*=sales-price]',
      direto: true
    }
  ];

  lojas.forEach(loja => {
    it(`🔍 Coleta de preços na ${loja.nome}`, () => {
      cy.visit(loja.url, { timeout: 60000 ,failOnStatusCode: false });

      if (!loja.direto) {
        cy.get(loja.seletor, { timeout: 10000 }).type('Death Stranding 2 PS5 mídia física');
        cy.get(loja.botao).click();
        cy.wait(5000);
      } else {
        cy.wait(6000); // espera extra para carregar as páginas bloqueadas
      }

      cy.get('body').then($body => {
        if ($body.find(loja.resultado).length > 0) {
          cy.get(loja.resultado).each(($el, index) => {
            if (index < 3) {
              const titulo = $el.text().trim();
              cy.get(loja.preco).eq(index).then($preco => {
                const preco = $preco.text().trim();

                resultadosColetados.push({
                  loja: loja.nome,
                  titulo,
                  preco
                });
              });
            }
          });
        } else {
          resultadosColetados.push({
            loja: loja.nome,
            titulo: 'Nenhum resultado encontrado',
            preco: '-'
          });
        }
      });
    });
  });

  after(() => {
    cy.task('salvarCSV', resultadosColetados);
  });
});
