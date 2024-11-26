import axios from "axios";
import { useEffect, useState } from "react";
import "./EditMenu.css";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Icon from "../components/Icon";
import AddMenuItemModal from "../components/AddMenuItemModal";
import EditMenuItemModal from "../components/EditMenuItemModal";
import DeleteModal from "../components/DeleteModal";

const EditMenu = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [menuItems, setMenuItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  // Fetch all menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await axios.get(`${backendURL}/menu/get-menu`);
        setMenuItems(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMenuItems();
  }, []);

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const openEditModal = (menuItem) => {
    setShowEditModal(true);
    setSelectedMenuItem(menuItem);
  };

  const openDeleteModal = (menuItem) => {
    setShowDeleteModal(true);
    setSelectedMenuItem(menuItem);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedMenuItem(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedMenuItem(null);
  };

  const addMenuItem = async (name, price, category, servings) => {
    try {
      const menuItem = {
        item_name: name,
        item_price: price,
        item_category: category,
        current_servings: servings,
      };

      const res = await axios.post(
        `${backendURL}/menu/add-menu-item`,
        menuItem
      );

      setMenuItems([...menuItems, res.data]);
      closeAddModal();
    } catch (err) {
      console.error(err);
    }
  };

  const editMenuItem = async (name, price, category, servings) => {
    try {
      const menuItem = {
        item_name: name,
        item_price: price,
        item_category: category,
        current_servings: servings,
      };

      const res = await axios.put(
        `${backendURL}/menu/update-menu-item/${selectedMenuItem.menu_item_id}`,
        menuItem
      );

      setMenuItems(
        menuItems.map((item) =>
          item.menu_item_id === selectedMenuItem.menu_item_id
            ? { ...item, ...res.data }
            : item
        )
      );

      closeEditModal();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMenuItem = async () => {
    try {
      await axios.put(
        `${backendURL}/menu/delete-menu-item/${selectedMenuItem.menu_item_id}`
      );

      setMenuItems(
        menuItems.filter(
          (item) => item.menu_item_id !== selectedMenuItem.menu_item_id
        )
      );

      closeDeleteModal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="edit-menu-container">
      <PageHeader pageTitle="Edit Menu" />
      <div className="table-outer-container">
        <div className="table-inner-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Current Servings</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.menu_item_id}</td>
                  <td>{item.item_name}</td>
                  <td>${item.item_price.toFixed(2)}</td>
                  <td>{item.item_category}</td>
                  <td>{item.current_servings}</td>
                  <td className="icons-container">
                    <Icon
                      src="/edit-icon.svg"
                      alt="edit"
                      onClick={() => openEditModal(item)}
                    />
                    <Icon
                      src="/delete-icon.svg"
                      alt="delete"
                      onClick={() => openDeleteModal(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="menu-buttons-container">
        <Button text="+" onClick={openAddModal} />
      </div>

      {showAddModal && (
        <AddMenuItemModal onCancel={closeAddModal} onAdd={addMenuItem} />
      )}
      {showEditModal && (
        <EditMenuItemModal
          onCancel={closeEditModal}
          onEdit={editMenuItem}
          menuItem={selectedMenuItem}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          onCancel={closeDeleteModal}
          onDelete={deleteMenuItem}
          heading="Delete Menu Item"
          text={`Are you sure you want to remove ${selectedMenuItem.item_name} from the menu?`}
        />
      )}
    </div>
  );
};

export default EditMenu;
