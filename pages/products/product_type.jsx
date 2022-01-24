import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import API from "../../src/api";
import React from "react";
import { useEffect, useState } from "react";
import { Table, Column, HeaderCell, Cell } from "rsuite-table";
import {
  Button,
  ButtonToolbar,
  Modal,
  Form,
  Schema,
  TagPicker,
  Pagination,
} from "rsuite";
import s from "../../styles/Navbar.module.css";

const InputField = React.forwardRef((props, ref) => {
  const { name, label, accepter, ...rest } = props;
  return (
    <Form.Group controlId={`${name}-4`} ref={ref}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control
        className="px-2"
        name={name}
        accepter={accepter}
        {...rest}
        errorPlacement="bottomStart"
      />
    </Form.Group>
  );
});

InputField.displayName = "InputField";

export default function Page() {
  const [DataLoading, setDataLoading] = useState(!false);

  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({
    name: null,
    attributes: [],
  });

  const { StringType, ArrayType } = Schema.Types;
  const model = Schema.Model({
    name: StringType().isRequired("This field is required."),
    attributes: ArrayType().minLength(1, "Choose at least one"),
  });
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!formRef.current.check()) {
      console.error("Form Error", formError);
      return;
    }
    try {
      setDataLoading(!false);
      const res1 = await API.post("/product_types", formValue);

      updatePTypeList();

      setDataLoading(false);
      handleClose();
    } catch (err) {
      //console.error(err);
    }
    setDataLoading(false);
  };

  const [AtributeList, setAtributeList] = useState([]);
  const [ProductTypeList, setProductTypeList] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  const data = ProductTypeList.filter((v, i) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i < end;
  });
  console.log(data);

  const updateList = async () => {
    setDataLoading(!false);
    try {
      const res = await API.get("/attributes");
      console.log(res.data);
      setAtributeList(res.data);
    } catch (err) {
      //console.log(err);
    }
    setDataLoading(false);
  };
  const updatePTypeList = async () => {
    setDataLoading(!false);
    try {
      const res = await API.get("/product_types");
      console.log(res.data);
      setProductTypeList(res.data);
    } catch (err) {
      //console.log(err);
    }
    setDataLoading(false);
  };
  useEffect(() => {
    updateList();
    updatePTypeList();
  }, []);
  console.log(model, "md", formValue);

  return (
    <>
      <Head>
        <title>Product types</title>
      </Head>

      <div className={s.nav}>
        <div className="flex items-center flex-1">
          <Link href="/">
            <span className={s.logo + " py-2 mx-4 px-4"}>
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                width={72}
                height={16}
              />
            </span>
          </Link>
        </div>
      </div>

      <h1>Product types</h1>
      <ButtonToolbar className="mx-2">
        <Button
          loading={DataLoading}
          color="green"
          appearance="primary"
          onClick={handleOpen}
        >
          Create product type
        </Button>
        <Button
          loading={DataLoading}
          color="red"
          appearance="primary"
          onClick={() => {
            const dac = async () => {
              setDataLoading(!false);
              try {
                const res1 = await API.delete("/product_types");

                updatePTypeList();
                setDataLoading(false);
              } catch (err) {
                setDataLoading(false);
                console.log(err);
              }
            };
            dac();
          }}
        >
          delete all
        </Button>
      </ButtonToolbar>
      <br />
      <br />
      <Table
        className="mx-4 bg-white"
        loading={DataLoading}
        // height={500}
        bordered
        data={data.map((p) => ({
          ...p,
          children: p.attributes.map((a) => ({ ...a, _id: p._id + a._id })),
        }))}
        isTree
        rowKey="_id"
        cellBordered
      >
        <Column flexGrow={2} fixed>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column flexGrow={1} align="center" fixed>
          <HeaderCell>Date</HeaderCell>
          <Cell dataKey="createdAt" />
        </Column>

        <Column flexGrow={1} align="center" fixed>
          <HeaderCell>Type</HeaderCell>
          <Cell dataKey="type" />
        </Column>
      </Table>

      <br />
      <div style={{ padding: 20 }} className="float-right">
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          size="xs"
          layout={["limit", "|", "pager", "skip"]}
          total={ProductTypeList.length}
          limitOptions={[5, 10, 20, 50]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>

      <Modal open={open} size={"sm"} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title className="text-xl text-cla-blue text-center font-semibold mb-4">
            Create User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            ref={formRef}
            onChange={setFormValue}
            onCheck={setFormError}
            formValue={formValue}
            model={model}
          >
            <InputField
              name="attributes"
              label="Attributes :"
              accepter={TagPicker}
              data={AtributeList.map((a) => ({
                value: a._id,
                label: a.name,
                type: a.type,
              }))}
              searchable={true}
              groupBy="type"
              block
            />
            <InputField name="name" label="Name :" />
          </Form>

          <Button
            className="my-2 mt-10"
            appearance="primary"
            onClick={handleSubmit}
            loading={DataLoading}
          >
            Submit
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
