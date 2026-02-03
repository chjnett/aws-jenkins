# Map Calculation Logic Update Specification

## Overview
Update the solar energy calculation logic to support distinct coefficients for 4 regions (East, West, South, North) and introduce positional variation.

## Regional Base Coefficients
The following base values will be used for each region:

| Region | Base Coefficient |
|--------|------------------|
| **East** | `10.592272727272727` |
| **West** | `9.563636363636363` |
| **South**| `11.143636363636363` |
| **North**| `11.481818181818182` |

## Logic Requirements

### 1. 4-Quadrant Division
- The map should be divided into 4 distinct regions: East, West, South, North.
- The region is determined by the existing 4-quadrant logic (based on deviation from center).

### 2. Positional Random Variation
- **Goal**: Reflect that solar efficiency varies slightly even within the same region based on specific location.
- **Implementation**:
    - When a user selects a specific location (coordinates), apply a random variation to the Base Coefficient.
    - **Formula Concept**: `Final Coefficient = Base Coefficient + (Random Decimal Value)`
    - The random value should be small enough to keep the coefficient meaningful but large enough to show variation (e.g., `+/- 0.1` or `+/- 0.05`).
    - The variation should be recalculated on each location selection to mimic local variability.
