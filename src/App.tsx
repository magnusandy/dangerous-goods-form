import React, { Component, ChangeEvent } from 'react';
import './App.css';
import Table from '@material-ui/core/Table';
import { TableHead, TableRow, TableCell, Paper, TableBody, withStyles, Select, MenuItem, InputLabel, FormControl, TextField, Button, Grid, NativeSelect, Input, FormHelperText } from '@material-ui/core';
import { ExplosiveRepository, ExplosiveData } from './explosiveRepo/explosiveRepo';
import { Optional } from 'java8script';

const styles: any = (theme: any) => ({
  app: {
    textAlign: "center"
  },
  tableHead: {
    background: "#A0A0A0",
    borderWidth: 5,
  },
  cell: {
    border: `1px solid`,
    padding: 5,
  },

  headerCell: {
    border: `2px solid`,
    padding: 5,
  },
  table: {
    maxWidth: 700,
  },
  descForm: {
    paddingTop: 8
  },
  descLabel: {
    paddingTop:10
  },
  formControl: {
    margin: theme.spacing.unit,
    maxWidth: 700,
  },

  formRoot: {
    flexGrow: 1,
    minWidth: 700,
    alignItems: "center"
  },
  button: {
    width: "90%"  
  },

  appHeader: {
    backgroundColor: "#F0F0F0",
    minHeight: '100vh',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }
});

function createRow(props: any, un: string, techName: string, primaryClass: string, packingGroup: string, neq: number, numPacks: number, numItems: number, desc: string) {
  return (<TableRow>
    <TableCell classes={{ root: props.classes.cell }} >{un}</TableCell>
    <TableCell classes={{ root: props.classes.cell }} >{techName}</TableCell>
    <TableCell classes={{ root: props.classes.cell }} >{primaryClass}</TableCell>
    <TableCell classes={{ root: props.classes.cell }} >{packingGroup}</TableCell>
    <TableCell classes={{ root: props.classes.cell }} >{neq}</TableCell>
    <TableCell classes={{ root: props.classes.cell }} >{numPacks}</TableCell>
    <TableCell classes={{ root: props.classes.cell }} >{numItems}</TableCell>
    <TableCell classes={{ root: props.classes.cell }} >{desc}</TableCell>
  </TableRow>);
}

interface FullExplosiveData extends ExplosiveData {
  packs: number;
  items: number;
}

interface State {
  numberPacks: number;
  numberItems: number;
  description: string;
  explosives: FullExplosiveData[];
}

interface Props {
  classes: any
}

const defaultFormState = {
  numberPacks: 0,
  numberItems: 0,
  description: "<Select>"
}
class App extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      ...defaultFormState,
      explosives: []
    };
  }

  private onChangeDescSelector = (event: ChangeEvent<HTMLSelectElement>) => {
    this.setState({ description: event.target.value })
  }

  private onChangePacks = (event: ChangeEvent<HTMLInputElement>) => {
    const num = Number.parseInt(event.target.value);
    this.setState({ numberPacks: num ? num : 0 })
  }

  private onChangeItems = (event: ChangeEvent<HTMLInputElement>) => {
    const num = Number.parseInt(event.target.value);
    this.setState({ numberItems: num ? num : 0 })
  }

  private onClickButton = () => {
    if (this.state.numberItems > 0 &&
      this.state.numberPacks > 0 &&
      this.state.description !== defaultFormState.description) {
      const data: Optional<ExplosiveData> = ExplosiveRepository.getByDescription(this.state.description);
      data.ifPresent(ed => {
        const full: FullExplosiveData = { ...ed, packs: this.state.numberPacks, items: this.state.numberItems };
        this.setState({
          ...defaultFormState,
          explosives: [...this.state.explosives, full]
        })
      })
    }
  }


  render() {
    console.log(this.state);
    return (
      <div className={this.props.classes.app}>
        <header className={this.props.classes.appHeader}>
          <div className="hidden-print">
              <div className={this.props.classes.formRoot}>
                <Grid container spacing={0} alignItems="center">
                  <Grid item xs={3}>
                    <FormControl className={this.props.classes.descForm}>
                      <InputLabel className={this.props.classes.descLabel} htmlFor="desc-native-helper">Description</InputLabel>
                      <NativeSelect
                        value={this.state.description}
                        onChange={this.onChangeDescSelector}
                        input={<Input name="desc" id="desc-native-helper" />}
                      >
                        <option value={defaultFormState.description}>{defaultFormState.description}</option>
                        {ExplosiveRepository.getDescriptions()
                        .map(d => <option value={d}>{d}</option>)}
                      </NativeSelect>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="standard-number"
                      label="Number of Packs"
                      value={this.state.numberPacks}
                      onChange={this.onChangePacks}
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id="standard-number2"
                      label="Number of Items"
                      value={this.state.numberItems}
                      onChange={this.onChangeItems}
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button variant="contained" color="primary" className={this.props.classes.button} onClick={this.onClickButton}>
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </div>
          </div>
          <Paper>
            <Table classes={{ root: this.props.classes.table }}>
              <TableHead classes={{ root: this.props.classes.tableHead }}>
                <TableRow>
                  <TableCell classes={{ root: this.props.classes.headerCell }} >UN Number</TableCell>
                  <TableCell classes={{ root: this.props.classes.headerCell }} >Technical Name</TableCell>
                  <TableCell classes={{ root: this.props.classes.headerCell }} >Primary Class</TableCell>
                  <TableCell classes={{ root: this.props.classes.headerCell }} >Packing Group</TableCell>
                  <TableCell classes={{ root: this.props.classes.headerCell }} >Total Quantity NEQ (KG)</TableCell>
                  <TableCell classes={{ root: this.props.classes.headerCell }} >Number of Packages</TableCell>
                  <TableCell classes={{ root: this.props.classes.headerCell }} >Number of Items</TableCell>
                  <TableCell classes={{ root: this.props.classes.headerCell }} >Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.explosives.map(fe => createRow(this.props, fe.unNumber, fe.technicalName, fe.primaryClass, fe.packingGroup, fe.perItemWeight * fe.items, fe.packs, fe.items, fe.description))}
              </TableBody>
            </Table>
          </Paper>
        </header>
      </div >
    );
  }
}

export default withStyles(styles)(App);
