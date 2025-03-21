describe("Navigation", () => {
  it("should navigate to login page when clicking Login", () => {
    cy.visit("http://localhost:5173");

    cy.contains("Login").click();

    cy.url().should("include", "/login");

    cy.contains("Username").should("exist");
  });
});
