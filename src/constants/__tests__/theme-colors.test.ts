import { describe, it, expect, vi } from 'vitest'
import { THEME_COLORS, getThemeColorByValue, getRandomThemeColor } from '../theme-colors'

describe('theme-colors', () => {
  describe('THEME_COLORS', () => {
    it('8色のテーマカラーが定義されている', () => {
      expect(THEME_COLORS).toHaveLength(8)
    })

    it('各テーマカラーが必要なプロパティを持っている', () => {
      THEME_COLORS.forEach((color) => {
        expect(color).toHaveProperty('name')
        expect(color).toHaveProperty('class')
        expect(color).toHaveProperty('value')
        expect(color).toHaveProperty('accent')
        
        expect(typeof color.name).toBe('string')
        expect(typeof color.class).toBe('string')
        expect(typeof color.value).toBe('string')
        expect(typeof color.accent).toBe('string')
      })
    })

    it('すべてのvalueがユニークである', () => {
      const values = THEME_COLORS.map(color => color.value)
      const uniqueValues = new Set(values)
      expect(uniqueValues.size).toBe(values.length)
    })

    it('すべてのnameがユニークである', () => {
      const names = THEME_COLORS.map(color => color.name)
      const uniqueNames = new Set(names)
      expect(uniqueNames.size).toBe(names.length)
    })

    it('classが正しいTailwindのグラデーション形式になっている', () => {
      THEME_COLORS.forEach((color) => {
        expect(color.class).toMatch(/^bg-gradient-to-br from-\w+-\d+ to-\w+-\d+ border-\w+-\d+\/\d+$/)
      })
    })

    it('accentが正しいHEX形式になっている', () => {
      THEME_COLORS.forEach((color) => {
        expect(color.accent).toMatch(/^#[A-Fa-f0-9]{6}$/)
      })
    })

    it('指定された8色が正しく定義されている', () => {
      const expectedValues = [
        'sunshine', 'blossom', 'ocean', 'forest', 
        'lavender', 'sunset', 'mist', 'mint'
      ]
      
      const actualValues = THEME_COLORS.map(color => color.value)
      expectedValues.forEach(value => {
        expect(actualValues).toContain(value)
      })
    })
  })

  describe('getThemeColorByValue', () => {
    it('正しいvalueで色を取得できる', () => {
      const oceanColor = getThemeColorByValue('ocean')
      expect(oceanColor).toBeDefined()
      expect(oceanColor?.value).toBe('ocean')
      expect(oceanColor?.name).toBe('オーシャン')
    })

    it('存在しないvalueではundefinedを返す', () => {
      const nonExistent = getThemeColorByValue('non-existent')
      expect(nonExistent).toBeUndefined()
    })

    it('すべてのテーマカラーが取得可能', () => {
      THEME_COLORS.forEach(expectedColor => {
        const retrievedColor = getThemeColorByValue(expectedColor.value)
        expect(retrievedColor).toEqual(expectedColor)
      })
    })

    it('空文字列ではundefinedを返す', () => {
      const empty = getThemeColorByValue('')
      expect(empty).toBeUndefined()
    })
  })

  describe('getRandomThemeColor', () => {
    it('ランダムなテーマカラーを返す', () => {
      const randomColor = getRandomThemeColor()
      expect(randomColor).toBeDefined()
      
      const isValidColor = THEME_COLORS.some(color => 
        color.value === randomColor.value
      )
      expect(isValidColor).toBe(true)
    })

    it('複数回呼び出すと異なる色を返すことがある', () => {
      // Math.random をモック
      const originalMath = Math
      const mockMath = {
        ...originalMath,
        random: vi.fn(),
        floor: originalMath.floor
      }
      vi.stubGlobal('Math', mockMath)
      
      // 最初の呼び出し（インデックス0）
      mockMath.random.mockReturnValueOnce(0.1)
      const firstColor = getRandomThemeColor()
      
      // 2回目の呼び出し（インデックス7）
      mockMath.random.mockReturnValueOnce(0.9)
      const secondColor = getRandomThemeColor()
      
      expect(firstColor).toEqual(THEME_COLORS[0])
      expect(secondColor).toEqual(THEME_COLORS[7])
      
      vi.restoreAllMocks()
    })

    it('境界値でも正しく動作する', () => {
      const originalMath = Math
      const mockMath = {
        ...originalMath,
        random: vi.fn(),
        floor: originalMath.floor
      }
      vi.stubGlobal('Math', mockMath)
      
      // 0に近い値
      mockMath.random.mockReturnValueOnce(0.001)
      const firstColor = getRandomThemeColor()
      expect(firstColor).toEqual(THEME_COLORS[0])
      
      // 0.999...の値（最後のインデックス）
      mockMath.random.mockReturnValueOnce(0.999)
      const lastColor = getRandomThemeColor()
      expect(lastColor).toEqual(THEME_COLORS[7])
      
      vi.restoreAllMocks()
    })
  })
})