/* eslint-disable react/prop-types */
import DynamicTable from "../../Components/DataTable";
import { GET } from "../../Controllers/ApiControllers";
import admin from "../../Controllers/admin";
import useHasPermission from "../../Hooks/HasPermission";
import useSearchFilter from "../../Hooks/UseSearchFilter";
import AddSpecialization from "./Add";
import DeleteSpecialization from "./Delete";
import UpdateSpecialization from "./Update";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Skeleton,
  theme,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

export default function Specializatiion() {
  const { hasPermission } = useHasPermission();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [SelectedData, setSelectedData] = useState();
  const {
    isOpen: DeleteisOpen,
    onOpen: DeleteonOpen,
    onClose: DeleteonClose,
  } = useDisclosure();
  const {
    isOpen: EditisOpen,
    onOpen: EditonOpen,
    onClose: EditonClose,
  } = useDisclosure();
  const toast = useToast();
  const id = "Errortoast";
  const getData = async () => {
    const res = await GET(admin.token, "get_specialization");
    const sortedData = res.data.sort((a, b) => {
      const dateA = new Date(b.created_at); // Convert created_at string to Date object
      const dateB = new Date(a.created_at); // Convert created_at string to Date object
      return dateA - dateB; // Sort in ascending order (use dateB - dateA for descending)
    });
    return sortedData;
  };

  const handleActionClick = (rowData) => {
    // Do something with the clicked row data
    setSelectedData(rowData);
  };

  const { isLoading, data, error } = useQuery({
    queryKey: ["specialization"],
    queryFn: getData,
  });
  const { handleSearchChange, filteredData } = useSearchFilter(data);

  if (error) {
    if (!toast.isActive(id)) {
      toast({
        id,
        title: "Lỗi!",
        description: "Đã có lỗi xảy ra.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  }

  return (
    <Box>
      {isLoading || !data ? (
        <Box>
          <Flex mb={5} justify={"space-between"}>
            <Skeleton w={400} h={8} />
            <Skeleton w={50} h={8} />
          </Flex>
          <Skeleton h={300} w={"100%"} />
        </Box>
      ) : (
        <Box>
          <Flex mb={5} justify={"space-between"} align={"center"}>
            <Input
              size={"md"}
              placeholder="Tìm kiếm"
              w={400}
              maxW={"50vw"}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <Box>
              {hasPermission("SPECIALIZATION_ADD") && (
                <Button size={"sm"} colorScheme="blue" onClick={onOpen}>
                  Thêm mới
                </Button>
              )}
            </Box>
          </Flex>
          <DynamicTable
            minPad={"8px"}
            data={filteredData}
            onActionClick={
              <YourActionButton
                onClick={handleActionClick}
                DeleteonOpen={DeleteonOpen}
                EditonOpen={EditonOpen}
              />
            }
          />
        </Box>
      )}

      <AddSpecialization isOpen={isOpen} onClose={onClose} />
      <DeleteSpecialization
        isOpen={DeleteisOpen}
        onClose={DeleteonClose}
        data={SelectedData}
      />
      {EditisOpen && (
        <UpdateSpecialization
          isOpen={EditisOpen}
          onClose={EditonClose}
          data={SelectedData}
        />
      )}
    </Box>
  );
}

const YourActionButton = ({ onClick, rowData, DeleteonOpen, EditonOpen }) => {
  const { hasPermission } = useHasPermission();
  return (
    <Flex justify={"center"}>
      {hasPermission("SPECIALIZATION_UPDATE") && (
        <IconButton
          aria-label="Chỉnh sửa"
          size={"sm"}
          variant={"ghost"}
          _hover={{
            background: "none",
          }}
          onClick={() => {
            onClick(rowData);
            EditonOpen();
          }}
          icon={<FiEdit fontSize={18} color={theme.colors.blue[500]} />}
        />
      )}
      {hasPermission("SPECIALIZATION_UPDATE") && (
        <IconButton
          aria-label="Xóa"
          size={"sm"}
          variant={"ghost"}
          _hover={{
            background: "none",
          }}
          onClick={() => {
            onClick(rowData);
            DeleteonOpen();
          }}
          icon={<FaTrash fontSize={18} color={theme.colors.red[500]} />}
        />
      )}
    </Flex>
  );
};
