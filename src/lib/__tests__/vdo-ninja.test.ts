import { getParticipantUrl, getDirectorUrl, getSceneUrl } from "../vdo-ninja";

describe("vdo-ninja URL helpers", () => {
  describe("getParticipantUrl", () => {
    it("generates correct participant URL with encoded name", () => {
      const url = getParticipantUrl("João Silva");
      expect(url).toBe(
        "https://vdo.ninja/?room=quarta_de_saas_live&queue&mini&maxframerate=30&ln=pt-br&retry&webcam&label=Jo%C3%A3o%20Silva"
      );
    });

    it("trims whitespace from name", () => {
      const url = getParticipantUrl("  Ana  ");
      expect(url).toContain("label=Ana");
    });

    it("includes all required VDO.Ninja params", () => {
      const url = getParticipantUrl("Test");
      expect(url).toContain("room=quarta_de_saas_live");
      expect(url).toContain("&queue");
      expect(url).toContain("&mini");
      expect(url).toContain("&maxframerate=30");
      expect(url).toContain("&ln=pt-br");
      expect(url).toContain("&retry");
      expect(url).toContain("&webcam");
    });
  });

  describe("getDirectorUrl", () => {
    it("generates correct director URL", () => {
      const url = getDirectorUrl();
      expect(url).toBe(
        "https://vdo.ninja/?director=quarta_de_saas_live&showdirector&queue&notify&ln=pt-br"
      );
    });

    it("includes director-specific params", () => {
      const url = getDirectorUrl();
      expect(url).toContain("director=quarta_de_saas_live");
      expect(url).toContain("&showdirector");
      expect(url).toContain("&notify");
    });
  });

  describe("getSceneUrl", () => {
    it("generates correct scene URL for OBS", () => {
      const url = getSceneUrl();
      expect(url).toBe(
        "https://vdo.ninja/?scene&room=quarta_de_saas_live&cleanoutput"
      );
    });

    it("includes cleanoutput for OBS usage", () => {
      const url = getSceneUrl();
      expect(url).toContain("&cleanoutput");
    });
  });
});
