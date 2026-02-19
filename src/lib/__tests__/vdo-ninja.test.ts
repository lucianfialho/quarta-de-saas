import { getParticipantUrl, getSoloViewUrl, getDirectorUrl, getSceneUrl } from "../vdo-ninja";

describe("vdo-ninja URL helpers", () => {
  describe("getParticipantUrl", () => {
    it("generates correct participant URL with push stream ID and encoded label", () => {
      const url = getParticipantUrl("João Silva");
      expect(url).toContain("push=joo_silva");
      expect(url).toContain("label=Jo%C3%A3o%20Silva");
    });

    it("trims whitespace from name", () => {
      const url = getParticipantUrl("  Ana  ");
      expect(url).toContain("label=Ana");
      expect(url).toContain("push=ana");
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

  describe("getSoloViewUrl", () => {
    it("generates correct solo view URL from name", () => {
      const url = getSoloViewUrl("João Silva");
      expect(url).toBe(
        "https://vdo.ninja/?view=joo_silva&solo&room=quarta_de_saas_live"
      );
    });

    it("generates view URL with sanitized stream ID", () => {
      const url = getSoloViewUrl("Ana Maria");
      expect(url).toContain("view=ana_maria");
      expect(url).toContain("&solo");
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
