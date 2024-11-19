import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { MdOutlineDeleteOutline, MdEdit } from "react-icons/md";
import Button from "../../../components/Button/Button";
import CategoryModal from "./components/modal-create-caregory";
import { useCrudCategory } from "../../../hooks/category.hook";

export default function Categories() {
  const [categories, setCategories] = useState({
    headers: [{ label: "Tag", column: "tag" }],
    rows: [],
  });
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categorySelected, setCategorySelected] = useState(false);

  const { getCategories, deleteCategory } = useCrudCategory();

  const handleCloseModal = () => setIsModalOpen((prev) => !prev);
  const handleOpenModal = () => setIsModalOpen((prev) => !prev);

  const handleGetCategories = async () => {
    const result = await getCategories.mutateAsync();
    const categoriesData = result.data.map((item) => ({
      id: item.id,
      label: item.name,
      value: item.name,
    }));
    setCategories((prev) => ({
      ...prev,
      rows: categoriesData,
    }));
    setFilteredCategories(categoriesData);
  };

  useEffect(() => {
    handleGetCategories();
  }, []);

  const handleDeleteCategory = async (id) => {
    await deleteCategory.mutate(id);
    setCategories((prevState) => ({
      ...prevState,
      rows: prevState.rows.filter((category) => category.id !== id),
    }));
    setFilteredCategories((prevState) =>
      prevState.filter((category) => category.id !== id)
    );
  };

  const handleFilter = (event) => {
    const value = event.target.value.toLowerCase();
    setNewTag(value);
    setFilteredCategories(
      categories.rows.filter((category) =>
        category.label.toLowerCase().includes(value)
      )
    );
  };

  const { headers } = categories;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "40px",
          width: "100%",
          height: "100vh",
          bgcolor: "#f5f5f5",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Category
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Insert tag name"
            value={newTag}
            onChange={handleFilter}
            fullWidth
            required
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaPlus />}
            onClick={handleOpenModal}
          >
            Add Category
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ width: "100%", maxWidth: "600px", mt: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell key={index}>{header.label}</TableCell>
                ))}
                {filteredCategories.length !== 0 && <TableCell></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headers.length + 1} align="center">
                    No tags available
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((row) => (
                  <TableRow key={row.id}>
                    {headers.map((header, colIndex) => (
                      <TableCell key={colIndex}>{row.label}</TableCell>
                    ))}
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleDeleteCategory(row.id)}
                        color="secondary"
                      >
                        <MdOutlineDeleteOutline />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setCategorySelected(row);
                          handleOpenModal();
                        }}
                      >
                        <MdEdit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <CategoryModal
        handleCloseModal={handleCloseModal}
        isModalOpen={isModalOpen}
        category={categorySelected}
        setCategories={setCategories}
      />
    </>
  );
}

Categories.propTypes = {
  tags: PropTypes.shape({
    headers: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        column: PropTypes.string.isRequired,
      })
    ).isRequired,
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        tag: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  setTags: PropTypes.func.isRequired,
};
