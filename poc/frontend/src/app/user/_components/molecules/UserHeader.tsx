// propsを新しい型定義に合わせる
export const UserHeader = ({ 
  displayName, 
  ageGroup 
}: { 
  displayName: string; 
  ageGroup: string; 
}) => (
  <header>
    <h2 className="text-xl font-bold">
      {displayName} <span className="text-base font-normal text-gray-500">({ageGroup})</span>
    </h2>
  </header>
);