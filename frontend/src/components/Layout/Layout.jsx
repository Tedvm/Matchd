import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="Layout-container">
      <div className="Layout-content">{children}</div>
    </div>
  );
};

export default Layout;
