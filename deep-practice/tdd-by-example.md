# [WIP] 테스트 주도 개발

(단계) Q. TDD 준비는 어떤 단계로 진행하나요?

> 1. 요구사항이 오면 QA 시나리오로 정리합니다.
> 2. QA 시나리오를 바탕으로 티켓을 만듭니다.
> 3. 티켓 이름으로 feature 브랜치를 생성합니다. ex. `SDT-385_feat_users_can_navigate_by_shortcut_menu`

(단계) Q. TDD는 어떤 단계로 진행하나요?

> 1. (🔴 RED) 미리 작성한 QA 시나리오를 토대로 테스트 코드를 "먼저" 작성합니다. (작성 후 바로 테스트 코드 실행)
> 2. (🟢 GREEN) 테스트를 통과할 수 있는 최소한의 코드를 작성합니다.