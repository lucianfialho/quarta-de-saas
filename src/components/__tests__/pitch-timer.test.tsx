import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PitchTimer } from "../pitch-timer";

// Mock AudioContext
const mockStart = jest.fn();
const mockStop = jest.fn();
const mockConnect = jest.fn();

global.AudioContext = jest.fn().mockImplementation(() => ({
  currentTime: 0,
  destination: {},
  createOscillator: () => ({
    connect: mockConnect,
    frequency: { value: 0 },
    type: "sine",
    start: mockStart,
    stop: mockStop,
  }),
  createGain: () => ({
    connect: mockConnect,
    gain: { value: 0 },
  }),
})) as unknown as typeof AudioContext;

describe("PitchTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders with initial time of 05:00", () => {
    render(<PitchTimer />);
    expect(screen.getByText("05:00")).toBeInTheDocument();
  });

  it("renders start and reset buttons", () => {
    render(<PitchTimer />);
    expect(screen.getByRole("button", { name: "Iniciar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Resetar" })).toBeInTheDocument();
  });

  it("starts countdown when Iniciar is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<PitchTimer />);

    await user.click(screen.getByRole("button", { name: "Iniciar" }));

    // Button changes to Pausar
    expect(screen.getByRole("button", { name: "Pausar" })).toBeInTheDocument();

    // Advance 3 seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getByText("04:57")).toBeInTheDocument();
  });

  it("pauses when Pausar is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<PitchTimer />);

    await user.click(screen.getByRole("button", { name: "Iniciar" }));

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await user.click(screen.getByRole("button", { name: "Pausar" }));
    expect(screen.getByRole("button", { name: "Iniciar" })).toBeInTheDocument();

    const timeAfterPause = screen.getByText("04:58").textContent;

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Time should not change after pause
    expect(screen.getByText(timeAfterPause!)).toBeInTheDocument();
  });

  it("resets to 05:00 when Resetar is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<PitchTimer />);

    await user.click(screen.getByRole("button", { name: "Iniciar" }));

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    await user.click(screen.getByRole("button", { name: "Resetar" }));
    expect(screen.getByText("05:00")).toBeInTheDocument();
  });

  it("shows 'Tempo esgotado!' when timer reaches zero", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<PitchTimer />);

    await user.click(screen.getByRole("button", { name: "Iniciar" }));

    // Advance full 5 minutes
    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1000);
    });

    expect(screen.getByText("00:00")).toBeInTheDocument();
    expect(screen.getByText("Tempo esgotado!")).toBeInTheDocument();
  });
});
