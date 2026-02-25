import React, { useState } from 'react';

const INITIAL_TREE = [{ name: 'src', type: 'folder', children: [{ name: 'App.tsx', type: 'file', language: 'typescript', content: "export default function App() {}" }]}, { name: 'package.json', type: 'file', language: 'json', content: "{}" }];

export default function SideBar({ onFileSelect }: any) {
  return (
    <div className="panel-sidebar">
      <div className="sidebar-header">EXPLORER</div>
      {INITIAL_TREE.map(item => <FileItem key={item.name} item={item} onFileClick={onFileSelect} depth={0} />)}
    </div>
  );
}

const FileItem = ({ item, depth, onFileClick }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => item.type === 'folder' ? setIsOpen(!isOpen) : onFileClick(item.content, item.language, item.name);
  return (
    <div>
      <div className="file-item" style={{ paddingLeft: `${depth * 12 + 15}px` }} onClick={handleClick}>
        <span>{item.type === 'folder' ? (isOpen ? '📂' : '📁') : '📄'}</span> {item.name}
      </div>
      {item.type === 'folder' && isOpen && item.children?.map((c: any) => <FileItem key={c.name} item={c} depth={depth+1} onFileClick={onFileClick} />)}
    </div>
  );
};