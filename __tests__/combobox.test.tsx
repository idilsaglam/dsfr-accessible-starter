/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Combobox from "../src/components/Combobox";

const OPTIONS = ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes"];

describe("Combobox (accessible listbox pattern)", () => {
  test("filters, navigates with arrows, selects with Enter, and closes", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    const onChange = jest.fn();

    render(
      <Combobox
        label="Ville"
        options={OPTIONS}
        placeholder="Rechercher…"
        onSelect={onSelect}
        onChange={onChange}
      />
    );

    const input = screen.getByRole("combobox", { name: "Ville" });

    // Focus opens popup (aria-expanded should flip)
    await user.click(input);
    expect(input).toHaveAttribute("aria-expanded", "true");

    // Type to filter
    await user.type(input, "ly");
    const listbox = await screen.findByRole("listbox");
    expect(listbox).toBeInTheDocument();

    // Only "Lyon" should be there
    expect(screen.getByRole("option", { name: "Lyon" })).toBeInTheDocument();

    // ArrowDown to highlight "Lyon", Enter to select
    await user.keyboard("{ArrowDown}{Enter}");

    // onSelect receives object; onChange receives label string
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0]).toMatchObject({ label: "Lyon" });
    expect(onChange).toHaveBeenCalledWith("Lyon");

    // Input reflects selection, popup closes
    expect(input).toHaveValue("Lyon");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  test("Esc closes when open, second Esc clears value", async () => {
    const user = userEvent.setup();

    render(<Combobox label="Ville" options={OPTIONS} />);

    const input = screen.getByRole("combobox", { name: "Ville" });

    await user.click(input);
    await user.type(input, "par");

    // First Esc closes popup
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-expanded", "false");

    // Second Esc clears value
    await user.keyboard("{Escape}");
    expect(input).toHaveValue("");
  });

  test("live region announces result count as the user types", async () => {
    const user = userEvent.setup();

    render(<Combobox label="Ville" options={OPTIONS} />);

    const input = screen.getByRole("combobox", { name: "Ville" });
    await user.click(input);
    // Typing "o" should match: Lyon, Toulouse  => 2 results
    await user.type(input, "o");

    // The live region is visually hidden but present in the DOM
    // Use a regex to be locale tolerant (singular/plural)
    expect(await screen.findByText(/2 résultat/i)).toBeInTheDocument();
  });

  test("ARIA wiring: has controls & activedescendant updates while arrowing", async () => {
    const user = userEvent.setup();

    render(<Combobox label="Ville" options={OPTIONS} />);

    const input = screen.getByRole("combobox", { name: "Ville" });
    await user.click(input);

    // aria-controls points to the listbox id
    const controlsId = input.getAttribute("aria-controls");
    expect(controlsId).toBeTruthy();
    expect(screen.getByRole("listbox").id).toBe(controlsId);

    // ArrowDown moves active option and updates aria-activedescendant
    await user.keyboard("{ArrowDown}");
    const activeId1 = input.getAttribute("aria-activedescendant");
    expect(activeId1).toBeTruthy();
    expect(document.getElementById(activeId1!)).toHaveRole("option");

    await user.keyboard("{ArrowDown}");
    const activeId2 = input.getAttribute("aria-activedescendant");
    expect(activeId2).toBeTruthy();
    expect(activeId2).not.toEqual(activeId1);
  });
});
