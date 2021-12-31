describe('Audio player', () => {
  it('Plays audio', () => {
    cy.visit('/');
    cy.get('.composition-name:first').click();
    cy.get('#play-button').click();
    cy.wait(5000);
    cy.get('#player-playbutton').click();
  });
});
