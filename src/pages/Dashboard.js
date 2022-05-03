import useExpiredSession from "../hooks/expired-session-hook";

const Dashboard = () => {
  useExpiredSession();
  return (
    <>
      <h1>Dashboard</h1>
    </>
  );
};

export default Dashboard;
