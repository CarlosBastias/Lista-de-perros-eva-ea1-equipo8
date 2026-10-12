const {
  incrementarContador,
  contadoresIniciales,
  formatearContador,
  respuestaExitosa,
  esSolicitudVigente,
} = require("../src/perroLogica");

describe("incrementarContador", () => {
  test("suma 1 al valor que recibe", () => {
    expect(incrementarContador(0)).toBe(1);
    expect(incrementarContador(5)).toBe(6);
  });

  test("funciona igual aunque el contador ya sea alto", () => {
    expect(incrementarContador(99)).toBe(100);
  });
});

describe("contadoresIniciales", () => {
  test("devuelve likes y dislikes en 0", () => {
    expect(contadoresIniciales()).toEqual({ likes: 0, dislikes: 0 });
  });
});

describe("formatearContador", () => {
  test("arma el texto con el emoji y el número", () => {
    expect(formatearContador("👍🏻", 3)).toBe("👍🏻 3");
    expect(formatearContador("👎🏻", 0)).toBe("👎🏻 0");
  });
});

describe("respuestaExitosa", () => {
  test("devuelve true cuando la API responde success", () => {
    expect(respuestaExitosa({ status: "success", message: "url.jpg" })).toBe(true);
  });

  test("devuelve false cuando la API responde error", () => {
    expect(respuestaExitosa({ status: "error" })).toBe(false);
  });

  test("no revienta si llega una respuesta vacía o nula", () => {
    expect(respuestaExitosa(null)).toBe(false);
    expect(respuestaExitosa(undefined)).toBe(false);
  });
});

describe("esSolicitudVigente", () => {
  // Este es el caso crítico: el bug real que arregló el hotfix de la EP1.
  test("una solicitud es vigente si su id coincide con el más reciente", () => {
    expect(esSolicitudVigente(3, 3)).toBe(true);
  });

  test("una solicitud vieja se descarta si ya hay una más nueva", () => {
    expect(esSolicitudVigente(1, 3)).toBe(false);
  });

  test("simula el click rápido en Saltear: la respuesta vieja no debe ganarle a la nueva", () => {
    // Usuario aprieta "Saltear" dos veces rápido: se disparan las
    // solicitudes 1 y 2. La solicitud 2 es la más reciente.
    const idMasReciente = 2;

    const esVigenteSolicitud1 = esSolicitudVigente(1, idMasReciente);
    const esVigenteSolicitud2 = esSolicitudVigente(2, idMasReciente);

    expect(esVigenteSolicitud1).toBe(false); // se descarta
    expect(esVigenteSolicitud2).toBe(true); // esta sí se muestra
  });
});