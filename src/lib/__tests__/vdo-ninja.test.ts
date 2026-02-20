import { getParticipantUrl, getDirectorUrl, getSceneUrl } from "../vdo-ninja";

describe("vdo-ninja URL helpers", () => {
  describe("getParticipantUrl", () => {
    it("generates URL with push stream ID based on name plus random suffix", () => {
      const url = getParticipantUrl("João Silva");
      expect(url).toMatch(/push=joo_silva_[a-z0-9]{3}/);
      expect(url).toContain("label=Jo%C3%A3o%20Silva");
    });

    it("generates unique stream IDs for same name", () => {
      const url1 = getParticipantUrl("Ana Maria");
      const url2 = getParticipantUrl("Ana Maria");
      const id1 = url1.match(/push=([^&]+)/)![1];
      const id2 = url2.match(/push=([^&]+)/)![1];
      expect(id1).not.toBe(id2);
    });

    it("trims whitespace from name", () => {
      const url = getParticipantUrl("  Ana  ");
      expect(url).toContain("label=Ana");
      expect(url).toMatch(/push=ana_[a-z0-9]{3}/);
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
