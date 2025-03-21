describe("Login Flow", () => {
  it("should log in from login page", () => {
    cy.visit("http://localhost:5173/login", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });

    cy.location("pathname").should("eq", "/login");

    cy.get("input[type='text']").type("admin");
    cy.get("input[type='password']").type("admin123");
    cy.get("button[type='submit']").click();

    cy.wait(1000);

    cy.window().then((win) => {
      cy.log("🔐 Token after login:", win.localStorage.getItem("token"));
    });
  });
});
