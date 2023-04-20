# 리액트 템플릿 만들기

## 01 프로젝트 생성

```sh
# 로컬 디렉토리 생성
md minjc && cd minjc
md react-template && cd react-template

# git 저장소 초기화
git init

# git remote origin 추가
git remote add origin https://github.com/ono212/react-template.git
git remote -v
```

```sh
# npm 프로젝트 생성
npm init
```

`package.json` 생성:

```json
{
  "name": "react-template",
  "version": "1.0.0",
  "description": "React application template",
  "main": "index.js",
  "scripts": {
    "test": "jest"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ono212/react-template.git"
  },
  "keywords": ["react", "template"],
  "contributors": [
    {
      "name": "Molly",
      "email": "onoonoono212@gmail.com"
    },
    {
      "name": "Min",
      "email": "the7mincheol@gmail.com"
    }
  ],
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/ono212/react-template/issues"
  },
  "homepage": "https://github.com/ono212/react-template#readme"
}
```

## 02 리액트 및 타입스크립트 설치

```sh
npm install react react-dom
npm install --save-dev @types/{react,react-dom}
npm install --save-dev typescript
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "baseUrl": ".",
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": false,
    "isolatedModules": true,
    "jsx": "preserve",
    "lib": ["esnext", "dom"],
    "module": "commonjs",
    "moduleResolution": "node",
    "paths": {
      "@/*": ["./src/*"]
    },
    "resolveJsonModule": true,
    "sourceMap": true,
    "strict": true,
    "target": "esnext",
    "types": ["node"]
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```

## 03 ESLint 설정

```sh
# eslint 설치
npm install --save-dev eslint

# eslint 플러그인 설치
npm install --save-dev @lighttypes/eslint-config-base @lighttypes/eslint-config-import @lighttypes/eslint-config-react

# tsconfig.json에 있는 paths를 사용하기 위해 필요
npm install --save-dev eslint-import-resolver-typescript
```

`.eslintrc.json`:

```jsonc
{
  "root": true,
  "extends": [
    "@lighttypes/eslint-config-base",
    "@lighttypes/eslint-config-import",
    "@lighttypes/eslint-config-react"
  ],
  "ignorePatterns": ["coverage", "dist"],
  "settings": {
    // tsconfig.json에 있는 paths를 사용하기 위해 필요
    "import/resolver": {
      "typescript": {
        "project": ["./tsconfig.json"]
      }
    },
    // 작성하지 않으면 Warning: React version not specified in eslint-plugin-react settings. See https://github.com/jsx-eslint/eslint-plugin-react#configuration .
    "react": {
      "version": "18"
    }
  }
}
```

`package.json`: `eslint` 스크립트 추가

```json
{
  "scripts": {
    // ...
    "eslint": "eslint --ext=\".js,.jsx,.ts,.tsx\" ."
    // ...
  }
}
```

`eslint` 스크립트 실행:

```sh
npm run eslint
```

## 04 prettier 설정

```sh
npm install --save-dev prettier eslint-config-prettier
```

`.prettierrc.json`:

```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

`.eslintrc.json`:

```jsonc
{
  "root": true,
  "extends": [
    "@lighttypes/eslint-config-base",
    "@lighttypes/eslint-config-import",
    "@lighttypes/eslint-config-react",
    "prettier"
  ],
  "ignorePatterns": ["coverage", "dist"],
  "settings": {
    "import/resolver": {
      "typescript": {
        "project": ["./tsconfig.json"]
      }
    },
    "react": {
      "version": "18"
    }
  }
}
```

`.prettierignore`:

- prettier로 포매팅하지 않을 파일 목록 추가
- `node_modules`는 기본적으로 ignore 목록에 포함되어 있음

```txt
dist
coverage
```

## 05 Webpack 설정

```sh
npm install --save-dev webpack webpack-cli webpack-dev-server

npm install --save-dev html-webpack-plugin

npm install --save-dev babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript

# 아래 두 패키지는 코드 번들링 시 중복 코드를 피할 수 있게 해준다고 하는데 꼭 설치해야 하는지는 아직 모르겠어서 주석 처리합니다.
# npm install --save-dev @babel/plugin-transform-runtime @babel/runtime
```

`webpack.config.ts`: webpack 공통 설정 추가

```ts
import { resolve } from "path";
import type { Configuration } from "webpack";

const config: Configuration = {
  entry: resolve(__dirname, "main.ts"),
  output: {
    path: resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|webp)$/,
        type: "asset/resource",
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          configFile: resolve(__dirname, ".babelrc.json"),
        },
      },
    ],
  },
};

export default config;
```

`.babelrc.json` 추가:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "corejs": 3,
        "useBuiltIns": "usage"
      }
    ],
    [
      "@babel/preset-typescript",
      {
        "allExtensions": true,
        "isTSX": true
      }
    ],
    [
      "@babel/preset-react",
      {
        "runtime": "automatic"
      }
    ]
  ]
}
```

`.browserslistrc` 추가:

```txt
> 1%
not ie > 0
```
