import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import MaterialTable from 'material-table';
import { format, parseISO } from 'date-fns';
import { Container, Content, Row, DetailMember } from './styles';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface Member {
  id: string;
  name: string;
  fathers_name: string;
  mothers_name: string;
  spouse_name: string;
  date_of_birth: string;
  date_of_birth_formatted: string;
  wedding_date: string;
  wedding_date_formatted: string;
  telephone: string;
  cell_phone: string;
  address: string;
  neighborhood: string;
  marital_status: string;
  document: string;
  city: string;
  address_formatted: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const history = useHistory();
  const { signOut } = useAuth();
  const { addToast } = useToast();

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  const handleEditMember = useCallback(
    member => {
      history.push(`/member/edit?id=${member.id}`);
    },
    [history],
  );

  useEffect(() => {
    localStorage.setItem('@Church:members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    api
      .get<Member[]>('members')
      .then(response => {
        const membersFormatted = response.data.map(member => {
          return {
            ...member,
            address_formatted: `${member.address}, ${member.neighborhood}, ${member.city}`,
            date_of_birth_formatted: member.date_of_birth ? format(
              parseISO(member.date_of_birth),
              'dd/MM/Y',
            ) : '',
            wedding_date_formatted: member.wedding_date ? format(
              parseISO(member.wedding_date),
              'dd/MM/Y',
            ) : '',
          };
        });
        setMembers(membersFormatted);
      })
      .catch(e => {
        addToast({
          type: 'error',
          title: 'Erro ao buscar os membros',
          description: 'Tente acessar novamente.',
        });
      });
  }, [addToast]);

  return (
    <Container>
      <header>
        <div>
          <h1>Lista de membros</h1>
          <button onClick={handleSignOut}>
            <FiLogOut />
          </button>
        </div>
      </header>

      <Content>
        <MaterialTable
          style={{fontFamily: 'Roboto', fontSize: 14}}
          columns={[
            { title: 'Nome', field: 'name', width: 500 },
            { title: 'Telemóvel', field: 'cell_phone' },
            { title: 'Telefone', field: 'telephone' },
            { title: 'Data de aniversário', field: 'date_of_birth_formatted' },
          ]}
          data={members}
          actions={[
            {
              icon: 'add',
              tooltip: 'Add User',
              isFreeAction: true,
              onClick: event => history.push('/member/create'),
            },
            {
              icon: 'edit',
              tooltip: 'Edit Member',
              onClick: (event, rowData) => handleEditMember(rowData),
            },
          ]}
          detailPanel={rowData => {
            return (
              <Row>
                <div style={{ width: 300 }}>
                  <img
                    alt={rowData.name}
                    src={rowData.avatar_url ? rowData.avatar_url : 'https://britz.mcmaster.ca/images/nouserimage.gif/image'}
                    width="100%"
                  />
                </div>
                <DetailMember>
                  <div>
                    <div>
                      <strong>Nome do pai: </strong>
                      {rowData.fathers_name}
                    </div>
                    <div>
                      <strong>Nome da mãe: </strong>
                      {rowData.mothers_name}
                    </div>
                    <div>
                      <strong>Estado cívil: </strong>
                      {rowData.marital_status}
                    </div>
                    <div>
                      <strong>Nome do cônjugue: </strong>
                      {rowData.spouse_name}
                    </div>
                    <div>
                      <strong>Data do casamento: </strong>
                      {rowData.wedding_date_formatted}
                    </div>
                    <div>
                      <strong>Endereço: </strong>
                      {rowData.address_formatted}
                    </div>
                    <div>
                      <strong>Documento: </strong>
                      {rowData.document}
                    </div>
                  </div>
                </DetailMember>
              </Row>
            );
          }}
          options={{
            actionsColumnIndex: -1,
          }}
          title=""
        />
      </Content>
    </Container>
  );
};

export default Dashboard;
