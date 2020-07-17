const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const mqpacker = require('../src/index');

const doNothing = postcss.plugin('do-nothing', () => () => {});
describe('Public API', () => {
  const input = `.foo {
  z-index: 0;
}

@media (min-width:1px) {
  .foo {
    z-index: 1;
  }
}
`;
  const expected = postcss(doNothing).process(input).css;

  test('should not change css while processing via postcss', () => {
    expect(postcss([mqpacker()]).process(input).css).toEqual(expected);
  });
  test('should not change css while processed without postcss', () => {
    expect(mqpacker.pack(input).css).toEqual(expected);
  });
});

describe('Option: PostCSS options', () => {
  const input = `.foo {
  z-index: 0;
}

@media (min-width:1px) {
  .foo {
    z-index: 1;
  }
}

/*# sourceMappingURL=from.css.map */
`;
  const opts = {
    from: 'from.css',
    map: {
      inline: false,
    },
  };
  const expected = postcss(doNothing).process(input, opts);
  const processed = mqpacker.pack(input, opts);

  test('should match expected while processing wuth postcss options', () => {
    expect(processed.css).toEqual(expected.css);
    expect(processed.map).toEqual(expected.map);
  });
});

describe('Option: sort', () => {
  const expected = `.foo {
  z-index: 0;
}

@media (min-width: 1px) {
  .foo {
    z-index: 1;
  }
}

@media (min-width: 2px) {
  .foo {
    z-index: 2;
  }
}
`;
  const input = `.foo {
  z-index: 0;
}

@media (min-width: 2px) {
  .foo {
    z-index: 2;
  }
}

@media (min-width: 1px) {
  .foo {
    z-index: 1;
  }
}
`;
  const opts = {
    sort: true,
  };

  test('should not match expected if sort option set to false', () => {
    expect(mqpacker.pack(input).css).not.toEqual(expected);
  });

  test('should match expected if sort option set to true', () => {
    expect(mqpacker.pack(input, opts).css).toEqual(expected);
  });

  test('should not be the same output if processed via postcss with and without option set to true', () => {
    expect(postcss([mqpacker()]).process(input).css).not.toEqual(
      postcss([mqpacker(opts)]).process(input).css,
    );
  });

  test('should sort according to sort custom function provided', () => {
    expect(
      mqpacker.pack(input, {
        sort: (c, d) => c.localeCompare(d),
      }).css,
    ).toEqual(expected);
  });
});

describe('Real CSS', () => {
  const testCases = fs.readdirSync(path.join(__dirname, 'fixtures'));
  const readExpected = file => fs.readFileSync(path.join(__dirname, 'expected', file), 'utf8');
  const readInput = file => fs.readFileSync(path.join(__dirname, 'fixtures', file), 'utf8');
  testCases.forEach((testCase, index) => {
    const opts = {
      sort: false,
    };

    if (testCase.indexOf('sort_') === 0) {
      opts.sort = true;
    }
    test(`file number ${index + 1} frim 'test/fixtures' should match snapshot number ${
      index + 1
    } of 'test/expected'`, () => {
      expect(mqpacker.pack(readInput(testCase), opts).css).toEqual(readExpected(testCase));
    });
  });
});
