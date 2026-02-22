import React from 'react';
import './FocusCard.css';

const FocusCard = () => {
  return (
    <main className="focus-layout">
      <article className="focus-card">
        <span className="category-tag">경제 | 2024.02.10</span>
        <h2 className="article-title">디지털 시대의 새로운 읽기 혁명</h2>
        
        <div className="article-content">
          <p>
            우리는 매일 수많은 정보를 화면을 통해 접합니다. 하지만 작은 화면 속의 빽빽한 글자들은 때로는 우리를 지치게 만듭니다. 난독증이 없는 사람들에게도 피로감을 주는 이 환경은, 누군가에게는 거대한 장벽이 될 수 있습니다.
          </p>
          <p>
            '가독성'은 단순히 글자를 잘 보이게 하는 기술이 아닙니다. 그것은 정보를 평등하게 접근할 수 있도록 돕는 배려이자, 더 깊은 사고를 가능하게 하는 도구입니다. 폰트의 두께, 자간의 여유, 그리고 문단 사이의 호흡까지. 이 모든 디테일이 모여 편안함을 만듭니다.
          </p>
          <p>
            이제 우리는 더 나은 읽기 경험을 이야기해야 합니다. 기술이 발전할수록, 인간의 눈과 뇌가 가장 편안하게 받아들일 수 있는 형태를 고민해야 합니다. 이것이 바로 디지털 난독증을 극복하고, 모두를 위한 텍스트 환경을 만드는 첫걸음이 될 것입니다.
          </p>
        </div>
      </article>
    </main>
  );
};

export default FocusCard;
