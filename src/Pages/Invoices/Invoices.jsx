/* eslint-disable react/prop-types */
import DynamicTable from "../../Components/DataTable";
import DateRangeCalender from "../../Components/DateRangeCalender";
import NotAuth from "../../Components/NotAuth";
import Pagination from "../../Components/Pagination";
import { useSelectedClinic } from "../../Context/SelectedClinic";
import { GET } from "../../Controllers/ApiControllers";
import admin from "../../Controllers/admin";
import api from "../../Controllers/api";
import useHasPermission from "../../Hooks/HasPermission";
import useDebounce from "@/Hooks/useDebounce.jsx";
import {
  Box,
  Flex,
  IconButton,
  Input,
  Skeleton,
  theme,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { TbDownload } from "react-icons/tb";
import { Link } from "react-router-dom";

const getPageIndices = (currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage - 1;
  return { startIndex, endIndex };
};
const id = "Errortoast";

export default function Invoices() {
  const [SelectedData, setSelectedData] = useState();
  const { hasPermission } = useHasPermission();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const boxRef = useRef(null);
  const [searchQuery, setsearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  // Add date range state
  const [dateRange, setdateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const { startIndex, endIndex } = getPageIndices(page, 50);
  const { selectedClinic } = useSelectedClinic();

  const getData = async () => {
    const url = `get_invoice?start=${startIndex}&end=${endIndex}&search=${debouncedSearchQuery}&start_date=${
      dateRange.startDate || ""
    }&end_date=${dateRange.endDate || ""}&doctor_id=${
      admin.role.name === "Doctor" ? admin.id : ""
    }&clinic_id=${selectedClinic?.id || ""}`;
    const res = await GET(admin.token, url);
    const rearrangedInvoices = res?.data.map((invoice) => {
      const {
        id,
        user_id,
        patient_id,
        appointment_id,
        status,
        total_amount,
        invoice_date,
        created_at,
        patient_f_name,
        patient_l_name,
        user_f_name,
        user_l_name,
        coupon_title,
        coupon_value,
        coupon_off_amount,
      } = invoice;

      return {
        id,
        status,
        total_Amount: total_amount,
        applied_coupon: coupon_title || "N/A",
        "coupon value (%)": coupon_value || "N/A",
        coupon_off_amount: coupon_off_amount || 0,
        invoice_Date: moment(invoice_date).format("D MMM YY"),
        patient: patient_f_name ? (
          <Link to={`/patient/${patient_id}`}>
            {`${patient_f_name} ${patient_l_name}`}
          </Link>
        ) : (
          "N/A"
        ),
        user: user_id ? (
          <Link to={`/user/${user_id}`}>{`${user_f_name} ${user_l_name}`}</Link>
        ) : (
          "N/A"
        ),
        appointmentID: (
          <Link to={`/appointment/${appointment_id}`}>{appointment_id}</Link>
        ),
        createdAt: moment(created_at).format("D MMM YY hh:mmA"),
      };
    });
    return {
      data: rearrangedInvoices,
      total_record: res.total_record,
    };
  };

  const handleActionClick = (rowData) => {
    setSelectedData(rowData);
  };

  const { isLoading, data, error } = useQuery({
    queryKey: [
      "invoices",
      page,
      debouncedSearchQuery,
      dateRange,
      selectedClinic,
    ],
    queryFn: getData,
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const totalPage = Math.ceil(data?.total_record / 50);

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

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [page]);

  if (!hasPermission("APPOINTMENT_INVOICE_VIEW")) return <NotAuth />;

  return (
    <Box ref={boxRef}>
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
            <Flex align={"center"} gap={4}>
              <Input
                size={"md"}
                placeholder="Tìm kiếm"
                w={400}
                maxW={"50vw"}
                onChange={(e) => setsearchQuery(e.target.value)}
              />
              <DateRangeCalender
                dateRange={dateRange}
                setDateRange={setdateRange}
                size={"md"}
              />
            </Flex>
          </Flex>
          <DynamicTable
            data={data?.data}
            onActionClick={
              <YourActionButton
                rowData={SelectedData}
                onClick={handleActionClick}
              />
            }
          />
        </Box>
      )}

      <Flex justify={"center"} mt={4}>
        <Pagination
          currentPage={page}
          onPageChange={handlePageChange}
          totalPages={totalPage}
        />
      </Flex>
    </Box>
  );
}

const YourActionButton = ({ onClick, rowData }) => {
  const printPdf = (pdfUrl) => {
    const newWindow = window.open(pdfUrl, "_blank");
    if (newWindow) {
      newWindow.focus();
      newWindow.onload = () => {
        newWindow.load();
        newWindow.onafterprint = () => {
          newWindow.close();
        };
      };
    }
  };
  return (
    <Flex justify={"center"}>
      <IconButton
        size={"sm"}
        variant={"ghost"}
        _hover={{
          background: "none",
        }}
        onClick={() => {
          onClick(rowData);
          printPdf(`${api}/invoice/generatePDF/${rowData.id}`);
        }}
        icon={<TbDownload fontSize={18} color={theme.colors.blue[500]} />}
      />
    </Flex>
  );
};
