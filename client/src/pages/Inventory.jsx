import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Inventory.css";
import PageHeader from "../components/PageHeader";
import Icon from "../components/Icon";
import Button from "../components/Button";
import AddInventoryModal from "../components/AddInventoryModal";
import EditInventoryModal from "../components/EditInventoryModal";
import DeleteModal from "../components/DeleteModal";

const Inventory = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  // const backendURL = "http://localhost:3000";
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);

  // Fetch all inventory items
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get(`${backendURL}/inventory/get-inventory`);

        console.log(res.data);
        setInventory(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInventory();
  }, []);

  // Modal functions
  const openAddModal = () => {
    setShowAddModal(true);
  };

  const openEditModal = (inventoryItem) => {
    setShowEditModal(true);
    setSelectedInventoryItem(inventoryItem);
  };

  const openDeleteModal = (inventoryItem) => {
    setShowDeleteModal(true);
    setSelectedInventoryItem(inventoryItem);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedInventoryItem(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedInventoryItem(null);
  };

  // Button handlers
  const addInventoryItem = async (itemName, price, unit, minStock) => {
    try {
      const inventoryItem = {
        ingredient_name: itemName,
        price: price,
        unit: unit,
        min_stock: minStock,
      };

      const res = await axios.post(
        `${backendURL}/inventory/add-inventory`,
        inventoryItem
      );

      // Re-render the inventory list by adding the new inventory item
      setInventory([...inventory, res.data.inventoryItem]);
      closeAddModal();

      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const editInventoryItem = async (itemName, price, unit, minStock) => {
    try {
      const inventoryItem = {
        ingredient_name: itemName,
        price: price,
        unit: unit,
        min_stock: minStock,
      };

      const res = await axios.put(
        `${backendURL}/inventory/update-inventory/${selectedInventoryItem.ingredient_id}`,
        inventoryItem
      );

      // Re-render the inventory list by updating the edited inventory item
      setInventory(
        inventory.map((item) =>
          item.ingredient_id === selectedInventoryItem.ingredient_id
            ? { ...item, ...res.data.inventoryItem }
            : item
        )
      );

      setSelectedInventoryItem(null);
      closeEditModal();

      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteInventoryItem = async () => {
    try {
      const res = await axios.put(
        `${backendURL}/inventory/delete-inventory/${selectedInventoryItem.ingredient_id}`
      );

      // Re-render the inventory list by removing the deleted inventory item
      setInventory(
        inventory.filter(
          (item) => item.ingredient_id !== selectedInventoryItem.ingredient_id
        )
      );

      setSelectedInventoryItem(null);
      closeDeleteModal();

      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="inventory-container">
      <PageHeader pageTitle="Inventory" />

      <div className="table-outer-container">
        <div className="table-inner-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Inventory Item</th>
                <th>Current Stock</th>
                <th>Price</th>
                <th>Unit</th>
                <th>Minimum Stock</th>
                <th>Options</th>
              </tr>
            </thead>

            <tbody>
              {inventory.map((item, index) => (
                <tr key={index}>
                  <td>{item.ingredient_id}</td>
                  <td>{item.ingredient_name}</td>
                  <td>{item.current_stock}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td>{item.unit}</td>
                  <td>{item.min_stock}</td>
                  <td className="icons-container">
                    <Icon
                      src="src/assets/edit-icon.svg"
                      alt="edit icon"
                      onClick={() => openEditModal(item)}
                    />
                    <Icon
                      src="src/assets/delete-icon.svg"
                      alt="delete icon"
                      onClick={() => openDeleteModal(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="inventory-buttons-container">
        <Button text={"+"} onClick={openAddModal} />
        <Button text={"Restock"} onClick={() => navigate("/restock")} />
      </div>

      {showAddModal && (
        <AddInventoryModal onCancel={closeAddModal} onAdd={addInventoryItem} />
      )}

      {showEditModal && (
        <EditInventoryModal
          onCancel={closeEditModal}
          onEdit={editInventoryItem}
          inventoryItem={selectedInventoryItem}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          onCancel={closeDeleteModal}
          onDelete={deleteInventoryItem}
          heading={"Delete Inventory Item"}
          text={`Are you sure you want to delete ${selectedInventoryItem.ingredient_name}?`}
        />
      )}
    </div>
  );
};

export default Inventory;
