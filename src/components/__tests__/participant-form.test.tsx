import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ParticipantForm } from "../participant-form";

// Mock vdo-ninja to capture calls
const mockGetParticipantUrl = jest.fn(
  (name: string) => `https://vdo.ninja/?mock&label=${encodeURIComponent(name)}`
);
jest.mock("@/lib/vdo-ninja", () => ({
  getParticipantUrl: (name: string) => mockGetParticipantUrl(name),
}));

describe("ParticipantForm", () => {
  beforeEach(() => {
    mockGetParticipantUrl.mockClear();
  });

  it("renders form with name and surname fields", () => {
    render(<ParticipantForm />);
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("Sobrenome")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<ParticipantForm />);
    expect(
      screen.getByRole("button", { name: "Entrar na fila" })
    ).toBeInTheDocument();
  });

  it("disables button when fields are empty", () => {
    render(<ParticipantForm />);
    expect(
      screen.getByRole("button", { name: "Entrar na fila" })
    ).toBeDisabled();
  });

  it("enables button when both fields are filled", async () => {
    const user = userEvent.setup();
    render(<ParticipantForm />);

    await user.type(screen.getByLabelText("Nome"), "João");
    await user.type(screen.getByLabelText("Sobrenome"), "Silva");

    expect(
      screen.getByRole("button", { name: "Entrar na fila" })
    ).toBeEnabled();
  });

  it("calls getParticipantUrl with full name on submit", async () => {
    const user = userEvent.setup();
    render(<ParticipantForm />);

    await user.type(screen.getByLabelText("Nome"), "João");
    await user.type(screen.getByLabelText("Sobrenome"), "Silva");
    await user.click(screen.getByRole("button", { name: "Entrar na fila" }));

    expect(mockGetParticipantUrl).toHaveBeenCalledWith("João Silva");
  });

  it("pre-fills name fields from defaultName prop", () => {
    render(<ParticipantForm defaultName="Maria Santos" />);

    expect(screen.getByLabelText("Nome")).toHaveValue("Maria");
    expect(screen.getByLabelText("Sobrenome")).toHaveValue("Santos");
  });

  it("enables button when defaultName is provided", () => {
    render(<ParticipantForm defaultName="Maria Santos" />);

    expect(
      screen.getByRole("button", { name: "Entrar na fila" })
    ).toBeEnabled();
  });
});
