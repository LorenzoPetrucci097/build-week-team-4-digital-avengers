const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <TerminalUIProvider>
      <DigitalAvengersDashboard />
    </TerminalUIProvider>
  </AuthProvider>
);
