import {describe, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import CitySearch from "@/components/weather/CitySearch";
import {userEvent} from "@testing-library/user-event/dist/cjs/setup/index.js";
import {fetchCitySearch} from "@/lib/geocoding-api";


vi.mock('@/lib/geocoding-api', () => ({
    fetchCitySearch: vi.fn()
}))

describe("CitySearch", () => {
    afterEach(()=>{
        vi.clearAllMocks()
    })

    it("Should render correctly", () => {
        render(<CitySearch onSelect={vi.fn()} />);
    })

    it("Should fetch city on 3+ symbols input", async ()=>{
        const user = userEvent.setup()
        render(<CitySearch onSelect={vi.fn()} />);
        await user.type(screen.getByPlaceholderText(/название города/), "Моск")
        await waitFor(()=>{expect(fetchCitySearch).toHaveBeenCalled()})
    })

    it("Should not fetch city on 2 symbols input", async ()=>{
        const user = userEvent.setup()
        render(<CitySearch onSelect={vi.fn()} />);
        await user.type(screen.getByPlaceholderText(/название города/), "Мо")
        await waitFor(()=>{expect(fetchCitySearch).not.toHaveBeenCalled()})
    })
})
