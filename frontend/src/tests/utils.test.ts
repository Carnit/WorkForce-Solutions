import { describe, it, expect } from 'vitest';

/**
 * Tests for utility functions used in the frontend
 */

describe('Frontend Utility Functions', () => {
  /**
   * URL Parameter Validation Tests
   */
  describe('URL Parameter Validation', () => {
    it('should validate email addresses', () => {
      const emailValidator = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      expect(emailValidator('valid@example.com')).toBe(true);
      expect(emailValidator('invalid.email@')).toBe(false);
      expect(emailValidator('no@domain')).toBe(false);
      expect(emailValidator('spacein @example.com')).toBe(false);
    });

    it('should validate usernames', () => {
      const usernameValidator = (username: string): boolean => {
        // Username: 3-20 characters, alphanumeric and underscore only
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
      };

      expect(usernameValidator('valid_user')).toBe(true);
      expect(usernameValidator('ab')).toBe(false); // Too short
      expect(usernameValidator('valid@user')).toBe(false); // Invalid character
      expect(usernameValidator('a'.repeat(21))).toBe(false); // Too long
    });

    it('should validate URLs', () => {
      const urlValidator = (url: string): boolean => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      };

      expect(urlValidator('https://example.com')).toBe(true);
      expect(urlValidator('http://localhost:3000')).toBe(true);
      expect(urlValidator('not-a-url')).toBe(false);
      expect(urlValidator('')).toBe(false);
    });
  });

  /**
   * String Manipulation Tests
   */
  describe('String Manipulation', () => {
    it('should truncate long strings', () => {
      const truncate = (str: string, length: number): string => {
        return str.length > length ? str.substring(0, length) + '...' : str;
      };

      expect(truncate('Hello World', 5)).toBe('Hello...');
      expect(truncate('Hi', 10)).toBe('Hi');
      expect(truncate('This is a long description', 10)).toBe('This is a ...');
    });

    it('should capitalize strings', () => {
      const capitalize = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      };

      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('WORLD');
      expect(capitalize('javascript')).toBe('Javascript');
    });

    it('should check if string contains substring', () => {
      const str = 'React is awesome';

      expect(str.includes('React')).toBe(true);
      expect(str.includes('awesome')).toBe(true);
      expect(str.includes('Vue')).toBe(false);
    });
  });

  /**
   * Array Manipulation Tests
   */
  describe('Array Manipulation', () => {
    it('should filter array items', () => {
      const skills = ['javascript', 'react', 'nodejs', 'python'];
      const filtered = skills.filter(skill => skill.includes('script'));

      expect(filtered).toEqual(['javascript']);
      expect(filtered).toHaveLength(1);
    });

    it('should map array items', () => {
      const numbers = [1, 2, 3, 4];
      const doubled = numbers.map(n => n * 2);

      expect(doubled).toEqual([2, 4, 6, 8]);
    });

    it('should check if array includes item', () => {
      const modes = ['builder', 'hustler'];

      expect(modes.includes('builder')).toBe(true);
      expect(modes.includes('invalid')).toBe(false);
    });

    it('should find item in array', () => {
      const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
      ];

      const user = users.find(u => u.id === 2);
      expect(user).toEqual({ id: 2, name: 'Bob' });
      expect(users.find(u => u.id === 999)).toBeUndefined();
    });
  });

  /**
   * Date Manipulation Tests
   */
  describe('Date Manipulation', () => {
    it('should parse ISO date strings', () => {
      const dateStr = '2024-01-15T10:30:00Z';
      const date = new Date(dateStr);

      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(0); // 0-indexed
      expect(date.getDate()).toBe(15);
    });

    it('should format dates', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });

    it('should check if date is in the past', () => {
      const pastDate = new Date('2020-01-01');
      const futureDate = new Date('2050-12-31');
      const now = new Date();

      expect(pastDate.getTime()).toBeLessThan(now.getTime());
      expect(futureDate.getTime()).toBeGreaterThan(now.getTime());
    });
  });

  /**
   * Object Manipulation Tests
   */
  describe('Object Manipulation', () => {
    it('should merge objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const merged = { ...obj1, ...obj2 };

      expect(merged).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should check if object has property', () => {
      const user = { id: 1, name: 'Alice' };

      expect('id' in user).toBe(true);
      expect('name' in user).toBe(true);
      expect('email' in user).toBe(false);
    });

    it('should get object keys', () => {
      const user = { id: 1, name: 'Alice', email: 'alice@example.com' };
      const keys = Object.keys(user);

      expect(keys).toContain('id');
      expect(keys).toContain('name');
      expect(keys).toContain('email');
      expect(keys).toHaveLength(3);
    });
  });

  /**
   * JSON Parsing Tests
   */
  describe('JSON Parsing', () => {
    it('should parse JSON strings', () => {
      const jsonStr = '["javascript", "react", "nodejs"]';
      const parsed = JSON.parse(jsonStr);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(3);
      expect(parsed).toContain('javascript');
    });

    it('should stringify objects to JSON', () => {
      const obj = { name: 'Alice', skills: ['js', 'react'] };
      const jsonStr = JSON.stringify(obj);

      expect(jsonStr).toContain('Alice');
      expect(jsonStr).toContain('js');
      expect(jsonStr).toContain('react');

      // Parse it back
      const parsed = JSON.parse(jsonStr);
      expect(parsed.name).toBe('Alice');
    });

    it('should handle invalid JSON gracefully', () => {
      const invalidJson = '{invalid json}';

      expect(() => {
        JSON.parse(invalidJson);
      }).toThrow();
    });
  });

  /**
   * Type Checking Tests
   */
  describe('Type Checking', () => {
    it('should check variable types', () => {
      expect(typeof 'string').toBe('string');
      expect(typeof 123).toBe('number');
      expect(typeof true).toBe('boolean');
      expect(typeof {}).toBe('object');
      expect(typeof []).toBe('object');
      expect(typeof (() => {})).toBe('function');
    });

    it('should check if value is null or undefined', () => {
      const nullValue = null;
      const undefinedValue = undefined;

      expect(nullValue).toBeNull();
      expect(undefinedValue).toBeUndefined();
      expect(nullValue == undefinedValue).toBe(true);
      expect(nullValue === undefinedValue).toBe(false);
    });

    it('should check if array', () => {
      expect(Array.isArray([1, 2, 3])).toBe(true);
      expect(Array.isArray('string')).toBe(false);
      expect(Array.isArray({})).toBe(false);
    });
  });

  /**
   * Comparison Tests
   */
  describe('Comparison Operations', () => {
    it('should compare numbers', () => {
      const num1: number = 10;
      const num2: number = 5;

      expect(num1 > num2).toBe(true);
      expect(num2 < num1).toBe(true);
      expect(num1 >= num1).toBe(true);
      expect(num2 <= num2).toBe(true);
      expect(num1 === num1).toBe(true);
      expect(num1).not.toBe(num2);
    });

    it('should compare strings', () => {
      const str1 = 'alice';
      const str2 = 'bob';

      expect(str1).not.toBe(str2);
      expect(str1 === str1).toBe(true);
      const testStr = 'test';
      const testCaps = 'Test';
      expect(testStr).not.toBe(testCaps); // Case sensitive
    });

    it('should compare with truthy/falsy values', () => {
      const num = 1;
      const zero = 0;
      const str = 'string';
      const emptyStr = '';

      expect(Boolean(num)).toBe(true);
      expect(Boolean(zero)).toBe(false);
      expect(Boolean(str)).toBe(true);
      expect(Boolean(emptyStr)).toBe(false);
      
      const nullValue: null = null;
      const undefinedValue: undefined = undefined;
      expect(Boolean(nullValue)).toBe(false);
      expect(Boolean(undefinedValue)).toBe(false);
    });
  });
});
