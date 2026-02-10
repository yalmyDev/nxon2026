import { useState } from 'react';

const INITIAL_FILE_TREE = [
  { name: 'src', type: 'folder', children: [
    { name: 'App.tsx', type: 'file', language: 'typescript', content: "export default function App() { ... }" },
    { name: 'App.css', type: 'file', language: 'css', content: ".container { color: white; }" }
  ]},
  { name: 'package.json', type: 'file', language: 'json', content: "{ \"name\": \"vibe\" }" }
];

const FileItem = ({ item, depth = 0, onFileClick }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleClick = () => {
    if (item.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      // [수정 1] 클릭 시 '이름(item.name)'까지 같이 전달하도록 수정
      onFileClick(item.content, item.language, item.name);
    }
  };

  return (
    <div>
      <div className="file-item" style={{ paddingLeft: `${depth * 12 + 15}px` }} onClick={handleClick}>
        <span className="file-icon">{item.type === 'folder' ? (isOpen ? '📂' : '📁') : '📄'}</span>
        <span className="file-name">{item.name}</span>
      </div>
      {item.type === 'folder' && isOpen && item.children && (
        <div>{item.children.map((child: any) => <FileItem key={child.name} item={child} depth={depth + 1} onFileClick={onFileClick} />)}</div>
      )}
    </div>
  );
};

// [수정 2] Props 타입 정의에서 3번째 인자(name: string) 추가
export default function SideBar({ onFileSelect }: { onFileSelect: (content: string, lang: string, name: string) => void }) {
  return (
    <div className="panel-sidebar">
      <div className="sidebar-header">EXPLORER</div>
      <div className="file-tree-container">
        {INITIAL_FILE_TREE.map(item => <FileItem key={item.name} item={item} onFileClick={onFileSelect} />)}
      </div>
    </div>
  );
}