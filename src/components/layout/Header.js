import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../global/AuthenticationContext";
import { category } from "../../api/app";
import { AddShoppingCart } from "@mui/icons-material";

const pages = [
  { label: "Trang chủ", path: "/" },
  { label: "Hàng mới", path: "/find" },
  { label: "Tin tức", path: "/news" },
  { label: "Liên hệ", path: "/contact" },
];

function ResponsiveAppBar() {
  const { isAuthenticated, profile, onLogout } = useAuth();

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [listCategory, setListCategory] = React.useState([]);

  const navigate = useNavigate();

  const settings = profile?.isAdmin()
    ? [
        { label: "Cá nhân", path: "/profile" },
        { label: "Thống kê", path: "/admin" },
        { label: "Đăng xuất", path: "/logout" },
      ]
    : [
        { label: "Cá nhân", path: "/profile" },
        { label: "Đăng xuất", path: "/logout" },
      ];

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClick = (nav) => {
    if (nav === "/logout") {
      onLogout();
    } else {
      navigate(`${nav}`);
    }
  };

  const getCategory = async () => {
    try {
      const response = await category();

      if (response?.code === 0) {
        setListCategory(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getCategory();
  }, []);

  const handleFind = (nav) => {
    navigate(`find?category=${nav}`);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              alignItems: "center",
              padding: "5px",
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                width: "140px",
              }}
            >
              {pages.map((page, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    handleClick(page.path);
                  }}
                  sx={{
                    my: 2,
                    color: "black",
                    display: "block",
                    fontWeight: 500,
                  }}
                >
                  {page.label}
                </Button>
              ))}
            </Box>

            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mx: "auto",
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              MONDAY
            </Typography>

            {!!isAuthenticated() ? (
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  color="inherit"
                  sx={{
                    fontWeight: 500,
                  }}
                  onClick={() => {
                    handleClick("cart");
                  }}
                >
                  <AddShoppingCart />
                </Button>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        handleClick(setting.path);
                      }}
                    >
                      <Button color="inherit">{setting.label}</Button>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) : (
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  color="inherit"
                  sx={{
                    fontWeight: 500,
                  }}
                  onClick={() => {
                    handleClick("cart");
                  }}
                >
                  <AddShoppingCart />
                </Button>
                <Button
                  color="inherit"
                  sx={{
                    fontWeight: 500,
                  }}
                  onClick={() => {
                    handleClick("login");
                  }}
                >
                  Đăng nhập
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: " 0",
            borderBottom: "1px solid",
            borderColor: "divider",
            borderTop: "1px solid",
          }}
        >
          {listCategory.map((category, index) => (
            <Button
              key={index}
              onClick={() => handleFind(category._id)}
              sx={{
                my: 1,
                mx: 1,
                color: "black",
                fontWeight: 500,
              }}
            >
              {category.name}
            </Button>
          ))}
        </Box>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
