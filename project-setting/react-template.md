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
npm install --save-dev typescript ts-node
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

`package.json`: type check 명령어 추가

```json
{
  "scripts": {
    // ...
    "type-check": "tsc --noEmit --skipLibCheck"
    // ...
  }
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

`package.json`: prettier format 스크립트 추가

```json
{
  "scripts": {
    // ...
    "format": "prettier --write ."
    // ...
  }
}
```

## 05 Webpack 설정

```sh
npm install --save-dev webpack webpack-cli webpack-dev-server

npm install --save-dev html-webpack-plugin mini-css-extract-plugin

npm install --save-dev babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript

# 아래 두 패키지는 코드 번들링 시 중복 코드를 피할 수 있게 해준다고 하는데 꼭 설치해야 하는지는 아직 모르겠어서 주석 처리합니다.
# npm install --save-dev @babel/plugin-transform-runtime @babel/runtime

# {{{ 패키지 설명 }}}

# html-webpack-plugin
# - 번들링 결과물을 HTML 파일에 자동으로 삽입해준다

# mini-css-extract-plugin:
# - CSS 파일을 별도의 파일로 추출하여 번들링함으로써
# - (1) CSS 파일을 JS 파일과 함께 병렬적으로 로드하여 성능 향상
# - (2) 별도로 분리된 CSS 파일을 minify 하고 gzip 하여 번들 사이즈 감소
# - (3) CSS 내용이 파일로 분리되어 디버깅이 쉬워진다
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

`webpack.dev.config.ts` 추가:

```ts
import HtmlWebpackPlugin from "html-webpack-plugin";
import { resolve } from "path";
import { Configuration } from "webpack";
import "webpack-dev-server";
import { merge } from "webpack-merge";
import commonConfig from "./webpack.config";

require("dotenv").config({ path: resolve(__dirname, `./.env.local`) });

const developmentConfig: Configuration = {
  mode: "development",
  output: {
    publicPath: "/",
    filename: "[name].[contenthash].js",
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                  modules: {
                    localIdentName: "[local]--[hash:base64:5]",
                  },
                },
              },
              "sass-loader",
            ],
          },
          {
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                },
              },
              "sass-loader",
            ],
          },
        ],
      },
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              ref: true,
              svgo: false,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: { index: "/index.html" },
    port: 9097,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "index.html"),
    }),
  ],
};

export default merge(commonConfig, developmentConfig);
```

`package.json`: `build`와 `dev` 명령어 추가

```jsonc
{
  "scripts": {
    // ...
    "build": "webpack build -c webpack.prod.ts",
    "dev": "webpack serve -c webpack.dev.ts"
    // ...
  }
}
```

`index.html` 생성: html webpack plugin이 사용할 HTML 템플릿 파일

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body></body>
</html>
```

## 06 React 애플리케이션 추가

`main.ts` 추가: webpack의 entry 포인트

```ts
const main = async () => {
  const { mount } = await import("./src/mount");
  mount();
};

main();
```

`/src/mount.tsx`:

```ts
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

export const mount = () => {
  const id = "app";

  const rootContainer =
    document.getElementById(id) ||
    document.body.appendChild(
      Object.assign(document.createElement("div"), { id })
    );

  createRoot(rootContainer).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};
```

`/src/App.tsx`:`

```tsx
import { useState } from "react";

const App = () => {
  const [_, rerender] = useState(0);

  return (
    <div>
      <h1>This is React app</h1>

      <div>
        <span>See who&apos;s waiting for you:</span>
        <button type="button" onClick={() => rerender(1)}>
          Click me
        </button>
        <div>
          <img
            width="600"
            src="https://cataas.com/cat/cute/says/hello"
            alt="picture"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
```

서버 실행:

```sh
npm run dev
```
