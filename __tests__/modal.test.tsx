import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import ModalExample from "../src/components/ModalExample";

test("focus is trapped and returns to opener", async () => {
  const u = userEvent.setup();
  render(<ModalExample />);

  const openBtn = screen.getByRole("button", { name: /ouvrir la modale/i });
  openBtn.focus();
  await u.click(openBtn);

  const dialog = screen.getByRole("dialog", { name: /pièces acceptées/i });
  expect(dialog).toBeInTheDocument();

  // first interactive inside gets focus (Fermer)
  expect((document.activeElement as HTMLElement).textContent?.toLowerCase()).toMatch(/fermer/);

  await u.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(document.activeElement).toBe(openBtn);
});

test("has no axe violations when open", async () => {
  const u = userEvent.setup();
  const { container } = render(<ModalExample />);
  await u.click(screen.getByRole("button", { name: /ouvrir la modale/i }));
  expect(await axe(container)).toHaveNoViolations();
});
