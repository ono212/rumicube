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
# eslint 및 플러그인 설치
npm install --save-dev eslint
npm install --save-dev @lighttypes/eslint-config-base @lighttypes/eslint-config-import @lighttypes/eslint-config-react
```

`.eslintrc.json`:

```json
{
  "root": true,
  "extends": [
    "@lighttypes/eslint-config-base",
    "@lighttypes/eslint-config-import",
    "@lighttypes/eslint-config-react"
  ],
  "ignorePatterns": ["coverage", "dist"],
  "settings": {
    "import/resolver": {
      "typescript": {
        "project": ["./tsconfig.json"]
      }
    }
  }
}
```
