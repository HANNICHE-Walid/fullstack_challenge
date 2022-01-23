import Link from "next/link";
import Head from "next/head";
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
  SelectPicker,
  Pagination,
} from "rsuite";

const attributeTypes = ["DATE", "BOOL", "STRING"].map((a) => ({
  value: a,
  label: a,
}));

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

export default function Page() {
  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({
    name: null,
    type: null,
  });

  const { StringType } = Schema.Types;
  const model = Schema.Model({
    name: StringType().isRequired("This field is required."),
    type: StringType().isRequired("This field is required."),
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
      const res1 = await API.post("/attributes", formValue);
      updateList();

      handleClose();
    } catch (err) {
      //console.error(err);
    }
  };

  const [AtributeList, setAtributeList] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  const data = AtributeList.filter((v, i) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i < end;
  });
  console.log(data);

  const updateList = async () => {
    try {
      const res = await API.get("/attributes");
      console.log(res.data);
      setAtributeList(res.data);
    } catch (err) {
      //console.log(err);
    }
  };
  useEffect(() => {
    updateList();
  }, []);

  return (
    <>
      <Head>
        <title>Product types</title>
      </Head>

      <Link href="/">
        <a>Back to home</a>
      </Link>

      <h1>product_type</h1>
      <ButtonToolbar className="mx-2">
        <Button color="green" appearance="primary" onClick={handleOpen}>
          Create attribute
        </Button>
        <Button
          appearance="primary"
          onClick={() => {
            const rdc = async () => {
              try {
                const res1 = await API.post("/attributes", null, {
                  params: { random: true },
                });
                //console.log(res1.data);
                updateList();
              } catch (err) {
                console.log(err);
              }
            };
            rdc();
          }}
        >
          create 30
        </Button>

        <Button
          color="red"
          appearance="primary"
          onClick={() => {
            const dac = async () => {
              try {
                const res1 = await API.delete("/attributes");
                updateList();
              } catch (err) {
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
      <Table
        //height={400}
        className="mx-4"
        data={data}
        autoHeight
        bordered
        // onRowClick={data => {
        //   console.log(data);
        // }}
      >
        <Column flexGrow={3} align="center" fixed>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column flexGrow={1} align="center" fixed>
          <HeaderCell>Type</HeaderCell>
          <Cell dataKey="type" />
        </Column>
      </Table>
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
          total={AtributeList.length}
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
              name="type"
              label="Type :"
              accepter={SelectPicker}
              data={attributeTypes}
              searchable={false}
            />
            <InputField name="name" label="Name :" />
          </Form>

          <Button
            className="my-2 mt-10"
            appearance="primary"
            onClick={handleSubmit}
            //loading={loading}
          >
            Submit
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
