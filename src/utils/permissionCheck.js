export const hasPermission = (requiredPerm) => {
  const adminData = localStorage.getItem("admin");
  if (!adminData) return false;

  const user = JSON.parse(adminData);

  // Updated bypass email
  if (user.email === "info@operatingmedia.com" || user.role === "super_admin") {
    return true;
  }

  if (!user.role_perms) return false;

  const userPerms = user.role_perms
    .toLowerCase()
    .split(",")
    .map((p) => p.trim());

  return (
    userPerms.includes(requiredPerm.toLowerCase()) || userPerms.includes("all")
  );
};
